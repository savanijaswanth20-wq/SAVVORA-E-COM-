-- ==============================================================================
-- SAVVORA E-COMMERCE PLATFORM - PAYMENT SYSTEM & REFUNDS MIGRATION
-- Migration Version: 20260801000000_payment_system.sql
-- Description: Advanced RPCs for Razorpay/COD checkout v2, signature verification,
--              failed payment recording, and automated refund inventory restocking.
-- ==============================================================================

-- 1. Enhanced RPC: Atomic Checkout & Order Creation Procedure (v2)
CREATE OR REPLACE FUNCTION public.create_order_checkout_v2(
  p_shipping_address JSONB,
  p_payment_method public.payment_method,
  p_items JSONB, -- Array of {product_id, quantity, custom_config}
  p_coupon_code TEXT DEFAULT NULL,
  p_gift_wrapping BOOLEAN DEFAULT false,
  p_gift_message TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_transaction_id TEXT DEFAULT NULL,
  p_provider_response JSONB DEFAULT NULL,
  p_payment_status public.payment_status DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_order_id UUID;
  v_order_number TEXT;
  v_subtotal DECIMAL(12,2) := 0;
  v_discount_amount DECIMAL(12,2) := 0;
  v_shipping_fee DECIMAL(12,2) := 0;
  v_total DECIMAL(12,2) := 0;
  v_item RECORD;
  v_product RECORD;
  v_current_stock INT;
  v_item_price DECIMAL(12,2);
  v_item_total DECIMAL(12,2);
  v_coupon RECORD;
  v_final_payment_status public.payment_status;
  v_initial_order_status public.order_status;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to place an order.';
  END IF;

  -- Determine payment & order initial status based on method & explicit param
  IF p_payment_status IS NOT NULL THEN
    v_final_payment_status := p_payment_status;
  ELSIF p_payment_method = 'cod' THEN
    v_final_payment_status := 'pending'::public.payment_status;
  ELSE
    v_final_payment_status := 'completed'::public.payment_status;
  END IF;

  IF v_final_payment_status = 'completed' OR p_payment_method = 'cod' THEN
    v_initial_order_status := 'confirmed'::public.order_status;
  ELSE
    v_initial_order_status := 'pending'::public.order_status;
  END IF;

  -- Generate unique Order Number (e.g. SAV-20260801-8912)
  v_order_number := 'SAV-' || to_char(now(), 'YYYYMMDD') || '-' || floor(1000 + random() * 9000)::text;

  -- 1. Calculate subtotal & verify inventory stock
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, quantity INT, custom_config JSONB)
  LOOP
    SELECT * INTO v_product FROM public.products WHERE id = v_item.product_id AND is_active = true;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product with ID % is unavailable.', v_item.product_id;
    END IF;

    SELECT stock_quantity INTO v_current_stock FROM public.inventory WHERE product_id = v_item.product_id FOR UPDATE;
    IF v_current_stock < v_item.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for product "%". Available: %, Requested: %', v_product.name, v_current_stock, v_item.quantity;
    END IF;

    v_item_price := v_product.price;
    v_item_total := v_item_price * v_item.quantity;
    v_subtotal := v_subtotal + v_item_total;
  END LOOP;

  -- 2. Process Coupon Code if provided
  IF p_coupon_code IS NOT NULL AND p_coupon_code != '' THEN
    SELECT * INTO v_coupon FROM public.coupons WHERE code = p_coupon_code AND is_active = true;
    IF FOUND THEN
      IF (v_coupon.expires_at IS NULL OR v_coupon.expires_at > now()) AND (v_coupon.usage_limit IS NULL OR v_coupon.used_count < v_coupon.usage_limit) AND v_subtotal >= v_coupon.min_purchase_amount THEN
        IF v_coupon.discount_type = 'percentage' THEN
          v_discount_amount := (v_subtotal * v_coupon.discount_value) / 100;
          IF v_coupon.max_discount_amount IS NOT NULL AND v_discount_amount > v_coupon.max_discount_amount THEN
            v_discount_amount := v_coupon.max_discount_amount;
          END IF;
        ELSE
          v_discount_amount := v_coupon.discount_value;
        END IF;

        -- Update coupon usage count
        UPDATE public.coupons SET used_count = used_count + 1 WHERE id = v_coupon.id;
      END IF;
    END IF;
  END IF;

  -- 3. Shipping fee & Gift wrapping fee
  IF v_subtotal < 999 THEN
    v_shipping_fee := 99.00;
  END IF;
  IF p_gift_wrapping THEN
    v_shipping_fee := v_shipping_fee + 49.00;
  END IF;

  v_total := GREATEST(0, (v_subtotal - v_discount_amount) + v_shipping_fee);

  -- 4. Create Order Record
  INSERT INTO public.orders (
    order_number, user_id, shipping_address, subtotal, discount_amount,
    shipping_fee, total_amount, coupon_code, status, payment_method,
    gift_wrapping, gift_message, notes
  ) VALUES (
    v_order_number, v_user_id, p_shipping_address, v_subtotal, v_discount_amount,
    v_shipping_fee, v_total, p_coupon_code, v_initial_order_status, p_payment_method,
    p_gift_wrapping, p_gift_message, p_notes
  ) RETURNING id INTO v_order_id;

  -- 5. Insert Order Items & Deduct Stock
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, quantity INT, custom_config JSONB)
  LOOP
    SELECT * INTO v_product FROM public.products WHERE id = v_item.product_id;
    SELECT stock_quantity INTO v_current_stock FROM public.inventory WHERE product_id = v_item.product_id;
    v_item_price := v_product.price;
    v_item_total := v_item_price * v_item.quantity;

    INSERT INTO public.order_items (
      order_id, product_id, product_name, product_sku, price, quantity, total_price, custom_config
    ) VALUES (
      v_order_id, v_product.id, v_product.name, v_product.sku, v_item_price, v_item.quantity, v_item_total, v_item.custom_config
    );

    -- Stock Deduction & History Logging
    UPDATE public.inventory
    SET stock_quantity = stock_quantity - v_item.quantity
    WHERE product_id = v_item.product_id;

    INSERT INTO public.inventory_history (
      product_id, change_amount, previous_stock, new_stock, reason, reference_id, created_by
    ) VALUES (
      v_product.id, -v_item.quantity, v_current_stock, (v_current_stock - v_item.quantity), 'order_placed', v_order_number, v_user_id
    );
  END LOOP;

  -- 6. Log Payment Record with transaction details
  INSERT INTO public.payments (
    order_id, user_id, payment_method, payment_status, amount, transaction_id, provider_response
  ) VALUES (
    v_order_id, v_user_id, p_payment_method, v_final_payment_status, v_total, p_transaction_id, p_provider_response
  );

  -- 7. Record Coupon Usage entry if applied
  IF v_coupon.id IS NOT NULL THEN
    INSERT INTO public.coupon_usages (coupon_id, user_id, order_id)
    VALUES (v_coupon.id, v_user_id, v_order_id);
  END IF;

  -- 8. Clear User Cart after successful checkout
  DELETE FROM public.cart_items WHERE user_id = v_user_id;

  -- 9. Insert Notification for User
  INSERT INTO public.notifications (
    user_id, title, message, type, link_url
  ) VALUES (
    v_user_id,
    'Order Confirmed! #' || v_order_number,
    'Your order of ₹' || trim(to_char(v_total, '999,999,999.00')) || ' has been placed successfully via ' || UPPER(p_payment_method::text) || '.',
    'order_status',
    '/account/orders/' || v_order_id
  );

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total_amount', v_total,
    'payment_status', v_final_payment_status,
    'order_status', v_initial_order_status
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. RPC: Process Payment Refund and Restock Inventory
CREATE OR REPLACE FUNCTION public.process_order_refund(
  p_order_id UUID,
  p_refund_amount DECIMAL(12,2),
  p_reason TEXT DEFAULT 'Customer requested refund'
)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_payment RECORD;
  v_item RECORD;
  v_current_stock INT;
BEGIN
  -- Verify calling user is staff/admin or order owner
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order with ID % not found.', p_order_id;
  END IF;

  IF NOT (auth.uid() = v_order.user_id OR public.is_staff()) THEN
    RAISE EXCEPTION 'Access denied. You do not have permission to refund this order.';
  END IF;

  SELECT * INTO v_payment FROM public.payments WHERE order_id = p_order_id LIMIT 1;

  -- Update Payment status
  UPDATE public.payments
  SET payment_status = 'refunded'::public.payment_status,
      refund_status = 'completed',
      updated_at = timezone('utc'::text, now()),
      provider_response = jsonb_set(
        COALESCE(provider_response, '{}'::jsonb),
        '{refund}',
        jsonb_build_object(
          'refund_amount', p_refund_amount,
          'reason', p_reason,
          'refunded_at', now()
        )
      )
  WHERE order_id = p_order_id;

  -- Update Order status
  UPDATE public.orders
  SET status = 'cancelled'::public.order_status,
      updated_at = timezone('utc'::text, now())
  WHERE id = p_order_id;

  -- Restock Inventory items from the refunded order
  FOR v_item IN SELECT * FROM public.order_items WHERE order_id = p_order_id
  LOOP
    IF v_item.product_id IS NOT NULL THEN
      SELECT stock_quantity INTO v_current_stock FROM public.inventory WHERE product_id = v_item.product_id FOR UPDATE;
      
      UPDATE public.inventory
      SET stock_quantity = stock_quantity + v_item.quantity,
          updated_at = timezone('utc'::text, now())
      WHERE product_id = v_item.product_id;

      INSERT INTO public.inventory_history (
        product_id, change_amount, previous_stock, new_stock, reason, reference_id, created_by
      ) VALUES (
        v_item.product_id, v_item.quantity, COALESCE(v_current_stock, 0), (COALESCE(v_current_stock, 0) + v_item.quantity), 'order_cancelled', v_order.order_number, auth.uid()
      );
    END IF;
  END LOOP;

  -- Notify user of refund
  INSERT INTO public.notifications (
    user_id, title, message, type, link_url
  ) VALUES (
    v_order.user_id,
    'Refund Processed #' || v_order.order_number,
    'Your refund of ₹' || trim(to_char(p_refund_amount, '999,999,999.00')) || ' has been processed. Reason: ' || p_reason,
    'order_status',
    '/account/orders/' || p_order_id
  );

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'refund_amount', p_refund_amount,
    'order_status', 'cancelled',
    'payment_status', 'refunded'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. RPC: Record Failed Payment Attempt
CREATE OR REPLACE FUNCTION public.record_payment_failure(
  p_order_id UUID,
  p_error_code TEXT DEFAULT 'PAYMENT_FAILED',
  p_error_description TEXT DEFAULT 'Payment was declined or cancelled'
)
RETURNS JSONB AS $$
BEGIN
  UPDATE public.payments
  SET payment_status = 'failed'::public.payment_status,
      updated_at = timezone('utc'::text, now()),
      provider_response = jsonb_set(
        COALESCE(provider_response, '{}'::jsonb),
        '{error}',
        jsonb_build_object(
          'code', p_error_code,
          'description', p_error_description,
          'failed_at', now()
        )
      )
  WHERE order_id = p_order_id;

  RETURN jsonb_build_object('success', true, 'status', 'failed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
