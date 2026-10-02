'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { getBrowserClient, isAuthConfigured } from '@/lib/supabase-browser';

export type PortalSession = { email: string; userId: string };

/**
 * Watches the Supabase session in the browser and exposes it to the portal.
 * Returns `loading` until the first check completes, and `unavailable` when
 * Supabase credentials are not configured on this deployment.
 */
export function usePortalSession() {
  const [session, setSession] = useState<PortalSession | null>(null);
  const [loading, setLoading] = useState(true);
  const available = isAuthConfigured();

  const apply = useCallback((user: { id: string; email?: string } | undefined) => {
    setSession(user ? { email: user.email ?? '', userId: user.id } : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!available) {
      setLoading(false);
      return;
    }

    const client = getBrowserClient();
    if (!client) {
      setLoading(false);
      return;
    }

    let active = true;

    void client.auth.getSession().then(({ data }) => {
      if (active) apply(data.session?.user);
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, next) => {
      apply(next?.user);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [apply, available]);

  return { session, loading, available };
}

/** Signs in with email + password, mapping failures onto a message key. */
export function useSignIn() {
  const t = useTranslations('auth');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(email: string, password: string) {
    const client = getBrowserClient();
    if (!client) {
      setError(t('errorGeneric'));
      return false;
    }

    setBusy(true);
    setError(null);

    const { error: signInError } = await client.auth.signInWithPassword({ email, password });

    setBusy(false);

    if (signInError) {
      setError(
        /invalid/i.test(signInError.message) ? t('invalid') : t('errorGeneric'),
      );
      return false;
    }

    return true;
  }

  return { signIn, busy, error };
}

/** Creates an account, falling back to a confirmation email when required. */
export function useRegister() {
  const t = useTranslations('auth');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function register(fullName: string, email: string, password: string) {
    const client = getBrowserClient();
    if (!client) {
      setError(t('errorGeneric'));
      return false;
    }

    setBusy(true);
    setError(null);

    const { data, error: registerError } = await client.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setBusy(false);

    if (registerError) {
      setError(t('errorGeneric'));
      return false;
    }

    setNeedsConfirmation(!data.session);
    return true;
  }

  return { register, busy, error, needsConfirmation };
}

export function useSignOut() {
  return useCallback(async () => {
    const client = getBrowserClient();
    await client?.auth.signOut();
  }, []);
}
