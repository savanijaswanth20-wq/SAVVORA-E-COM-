import { createClient } from '@/utils/supabase/client';

export interface UserProfileData {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'customer' | 'staff' | 'admin';
  profile_completed?: boolean;
  preferences?: string[];
}

export const SupabaseAuthService = {
  async signUp(email: string, password: string, fullName: string) {
    const supabase = createClient();
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signInWithOtp(phone: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phone.startsWith('+') ? phone : `+91${phone}`
    });
    if (error) throw error;
    return data;
  },

  async verifyOtp(phone: string, token: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone.startsWith('+') ? phone : `+91${phone}`,
      token,
      type: 'sms'
    });
    if (error) throw error;
    return data;
  },

  async uploadAvatar(file: File): Promise<string> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('user-avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    return publicUrl;
  },

  async getRedirectUrl() {
    // Prefer explicit production URL from env (avoids localhost redirect on deployed builds)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
    if (siteUrl) {
      return `${siteUrl.replace(/\/$/, '')}/auth/callback`;
    }
    // Fall back to current origin (works correctly for local dev)
    if (typeof window !== 'undefined' && window.location?.origin) {
      return `${window.location.origin}/auth/callback`;
    }
    return 'https://savvora-e-com.onrender.com/auth/callback';
  },

  async signInWithGoogle() {
    const supabase = createClient();
    const redirectUrl = await this.getRedirectUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
    if (error) throw error;
    return data;
  },

  async signInWithFacebook() {
    const supabase = createClient();
    const redirectUrl = await this.getRedirectUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: redirectUrl,
        // Request email + profile; Facebook may still omit email if unverified
        scopes: 'email public_profile',
        queryParams: {
          auth_type: 'rerequest', // force re-prompt if permissions were denied before
        }
      }
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getProfile(): Promise<UserProfileData | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data as UserProfileData;
  },

  async updateProfile(updates: Partial<UserProfileData>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async resetPasswordForEmail(email: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    if (error) throw error;
    return data;
  },

  async updateUserPassword(newPassword: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  }
};

