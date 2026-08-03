import { createClient } from '@/utils/supabase/client';
import { Address, AddressInput } from '@/types/address';

export const SupabaseAddressService = {
  async getAddresses(): Promise<Address[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
    return data || [];
  },

  async getDefaultAddress(): Promise<Address | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching default address:', error);
      return null;
    }
    return data;
  },

  async addAddress(input: AddressInput): Promise<Address> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to save an address');

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        ...input,
        user_id: user.id,
        country: input.country || 'India',
        is_default: input.is_default ?? false,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error adding address:', error);
      throw error;
    }
    return data;
  },

  async updateAddress(addressId: string, input: Partial<AddressInput>): Promise<Address> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in');

    const { data, error } = await supabase
      .from('addresses')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', addressId)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating address:', error);
      throw error;
    }
    return data;
  },

  async deleteAddress(addressId: string): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in');

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
    return true;
  },

  async setDefaultAddress(addressId: string): Promise<Address> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in');

    // First set all addresses for this user to is_default = false
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id);

    // Then set the selected address to is_default = true
    const { data, error } = await supabase
      .from('addresses')
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq('id', addressId)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
    return data;
  }
};
