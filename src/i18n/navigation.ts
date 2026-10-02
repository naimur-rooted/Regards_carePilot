import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware navigation helpers.
 * Import Link/useRouter from here instead of next/link so that the active
 * locale prefix is preserved automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
