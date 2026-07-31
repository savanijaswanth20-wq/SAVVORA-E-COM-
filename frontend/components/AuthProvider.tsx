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

      const existingLocal = KeychainStore.getUser();
      const instantProfile: UserProfile = {
        id: user.id,
        fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Customer',
        email: user.email || undefined,
        phone: user.phone || undefined,
        avatar: user.user_metadata?.avatar_url || undefined,
        loginProvider: user.app_metadata?.provider === 'facebook' ? 'Facebook' : user.app_metadata?.provider === 'google' ? 'Google' : user.phone ? 'Phone' : 'Email',
        role: 'customer',
        addresses: existingLocal?.addresses || [],
        profileCompleted: existingLocal?.profileCompleted ?? user.user_metadata?.profile_completed ?? false,
        preferences: existingLocal?.preferences || user.user_metadata?.preferences || []
      };
      KeychainStore.setUser(instantProfile);

      // Step 2: Asynchronously update profile in background without blocking UI
      try {
        const profile = await SupabaseAuthService.getProfile();
        if (profile) {
          KeychainStore.setUser({
            ...instantProfile,
            fullName: profile.full_name || instantProfile.fullName,
            email: profile.email || instantProfile.email,
            phone: profile.phone || instantProfile.phone,
            avatar: profile.avatar_url || instantProfile.avatar,
            role: profile.role || instantProfile.role,
            profileCompleted: profile.profile_completed ?? instantProfile.profileCompleted,
            preferences: profile.preferences || instantProfile.preferences
          });
        }
      } catch (err) {
        // Non-critical background fetch failure
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
