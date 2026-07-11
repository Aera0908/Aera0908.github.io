/**
 * Where a case file was opened from, so its BACK — the in-app "← BACK" button
 * *and* the native browser back button — returns there instead of replaying
 * the intro.
 *
 * Why a module-scoped variable (not sessionStorage): it survives client-side
 * route changes (same JS context, so the marker set when a case file is opened
 * is still here when <Home> re-mounts on back), but resets on a full page
 * reload — which is exactly when the intro *should* play again. sessionStorage
 * would wrongly persist across reloads.
 *
 * The desync this works around: the vault scroll-spy rewrites the URL to
 * /vault via history.replaceState, but Next's router tree stays pinned to the
 * "/" route. So any back-navigation to the one-pager re-mounts
 * <Home initialSection={null}> and boots the loader. Consumers:
 *   - VaultCard / archive page  → set() when opening a case file
 *   - CaseStudyBackButton       → consume() to route the in-app BACK
 *   - Home                      → peek()/consume() to skip the intro on return
 */
let returnTo: string | null = null;

export const navReturn = {
  /** Record where the case file about to open was launched from. */
  set(path: string) {
    returnTo = path;
  },
  /** Read the marker without clearing it. */
  peek(): string | null {
    return returnTo;
  },
  /** Read and clear the marker (one-shot). */
  consume(): string | null {
    const v = returnTo;
    returnTo = null;
    return v;
  },
};
