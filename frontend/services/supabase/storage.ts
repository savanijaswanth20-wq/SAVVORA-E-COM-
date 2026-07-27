import { createClient } from '@/utils/supabase/client';

export const SupabaseStorageService = {
  async uploadFile(bucket: 'product-images' | 'category-images' | 'user-avatars' | 'banner-images', path: string, file: File) {
    const supabase = createClient();
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true
    });

    if (error) throw error;
    return this.getPublicUrl(bucket, data.path);
  },

  getPublicUrl(bucket: string, path: string) {
    const supabase = createClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
};
