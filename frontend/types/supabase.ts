export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'customer' | 'staff' | 'admin'
export type OrderStatus = 'pending' | 'processing' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'cod' | 'razorpay' | 'stripe' | 'upi'
export type CouponType = 'percentage' | 'fixed_amount'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string | null
          phone: string | null
          avatar_url: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          sku: string
          category_id: string | null
          brand_id: string | null
          price: number
          original_price: number | null
          description: string
          features: string[]
          material: string | null
          badge: string | null
          is_featured: boolean
          is_trending: boolean
          is_new_arrival: boolean
          is_active: boolean
          rating: number
          review_count: number
          delivery_days: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sku: string
          category_id?: string | null
          brand_id?: string | null
          price: number
          original_price?: number | null
          description?: string
          features?: string[]
          material?: string | null
          badge?: string | null
          is_featured?: boolean
          is_trending?: boolean
          is_new_arrival?: boolean
          is_active?: boolean
          rating?: number
          review_count?: number
          delivery_days?: string
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          shipping_address: Json
          subtotal: number
          discount_amount: number
          shipping_fee: number
          tax_amount: number
          total_amount: number
          coupon_code: string | null
          status: OrderStatus
          payment_method: PaymentMethod
          tracking_number: string | null
          gift_wrapping: boolean
          gift_message: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id: string
          shipping_address: Json
          subtotal: number
          discount_amount?: number
          shipping_fee?: number
          tax_amount?: number
          total_amount: number
          coupon_code?: string | null
          status?: OrderStatus
          payment_method: PaymentMethod
          tracking_number?: string | null
          gift_wrapping?: boolean
          gift_message?: string | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string
          price: number
          quantity: number
          total_price: number
          custom_config: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku: string
          price: number
          quantity: number
          total_price: number
          custom_config?: Json | null
        }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          custom_config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          custom_config?: Json | null
        }
        Update: Partial<Database['public']['Tables']['cart_items']['Insert']>
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
        }
        Update: Partial<Database['public']['Tables']['wishlist_items']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string | null
          comment: string | null
          is_verified_purchase: boolean
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          title?: string | null
          comment?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
    }
    Functions: {
      create_order_checkout: {
        Args: {
          p_shipping_address: Json
          p_payment_method: PaymentMethod
          p_items: Json
          p_coupon_code?: string
          p_gift_wrapping?: boolean
          p_gift_message?: string
          p_notes?: string
        }
        Returns: Json
      }
      get_admin_dashboard_stats: {
        Args: Record<string, never>
        Returns: Json
      }
    }
  }
}
