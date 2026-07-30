"use client";

import React, { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SupabaseAuthService } from '@/services/supabase/auth';
import { KeychainStore, UserProfile } from '@/types/store';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const supabase = createClient();

    const syncSessionUser = async (user: any) => {
      if (!user) {
        KeychainStore.logoutUser();
        return;
      }

      try {
        const profile = await SupabaseAuthService.getProfile();
        const userProfile: UserProfile = {
          id: user.id,
          fullName: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Customer',
          email: user.email || profile?.email || undefined,
          phone: user.phone || profile?.phone || undefined,
          avatar: profile?.avatar_url || user.user_metadata?.avatar_url || undefined,
          loginProvider: user.app_metadata?.provider === 'google' ? 'Google' : user.phone ? 'Phone' : 'Email',
          role: profile?.role || 'customer',
          addresses: []
        };
        KeychainStore.setUser(userProfile);
      } catch (err) {
        console.warn("Could not fetch user profile from DB, using auth session fallback:", err);
        const userProfile: UserProfile = {
          id: user.id,
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Customer',
          email: user.email || undefined,
          phone: user.phone || undefined,
          avatar: user.user_metadata?.avatar_url || undefined,
          loginProvider: user.app_metadata?.provider === 'google' ? 'Google' : user.phone ? 'Phone' : 'Email',
          role: 'customer',
          addresses: []
        };
        KeychainStore.setUser(userProfile);
      }
    };

    // Initial session check on page load
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        syncSessionUser(user);
      }
    });

    // Subscribe to Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          syncSessionUser(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        KeychainStore.logoutUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
