import { useLocation } from 'react-router-dom'

/**
 * Returns the current active path for navbar highlighting.
 * Matches exact path for '/' (home) and startsWith for all others.
 */
export function useActiveSection(): string {
  const { pathname } = useLocation()
  return pathname
}
