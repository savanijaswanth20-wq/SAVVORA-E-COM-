-- Migration: 20260803000000_location_and_addresses.sql
-- Description: Create addresses table with RLS, coordinates, address types, and single default address trigger

CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    house TEXT NOT NULL,
    apartment TEXT,
    landmark TEXT,
    area TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    postal_code TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address_type TEXT NOT NULL CHECK (address_type IN ('home', 'work', 'other')) DEFAULT 'home',
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own addresses"
    ON public.addresses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
    ON public.addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
    ON public.addresses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
    ON public.addresses FOR DELETE
    USING (auth.uid() = user_id);

-- Function & Trigger to enforce a single default address per user
CREATE OR REPLACE FUNCTION public.handle_default_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = true THEN
        UPDATE public.addresses
        SET is_default = false
        WHERE user_id = NEW.user_id AND id <> NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_ensure_single_default_address ON public.addresses;

CREATE TRIGGER trigger_ensure_single_default_address
    BEFORE INSERT OR UPDATE OF is_default ON public.addresses
    FOR EACH ROW
    WHEN (NEW.is_default = true)
    EXECUTE FUNCTION public.handle_default_address();
