# Phase 8 Navbar Active Link Fix — Test Plan

## Root Cause Fixed
**Dual state problem:** NavbarClient and DesktopNav both managed `currentHash` state independently, causing:
- User clicks "Services" → NavbarClient updates via `setCurrentHash()`
- DesktopNav's `setCurrentHash()` fires on hashchange (100ms+ delayed)
- Inconsistent active link styling during that window

**Solution:** Single source of truth
- NavbarClient manages `currentHash` via hashchange listener
- DesktopNav receives `currentHash` as a prop
- `window.location.hash = hashPart` triggers automatic hashchange (no dual setters)

## Implementation Changes

### Change 1: navbar-client.tsx (Line 138)
```typescript
// BEFORE
window.history.pushState(null, "", `${targetPath}${selector}`);
setCurrentHash(selector);

// AFTER
window.location.hash = hashPart; // Triggers hashchange automatically
```

**Why:** `location.hash` assignment automatically fires the hashchange event, which triggers the single NavbarClient listener. No need to call `setCurrentHash()` — the listener will do it.

### Change 2: navbar-client.tsx (Line 234)
```typescript
// BEFORE
<DesktopNav navLinks={navLinks} onScroll={scrollToSection} onNavigate={navigateTo} />

// AFTER
<DesktopNav navLinks={navLinks} onScroll={scrollToSection} onNavigate={navigateTo} currentHash={currentHash} />
```

**Why:** Pass the parent's single-source-of-truth `currentHash` to DesktopNav.

### Change 3: desktop-nav.tsx (Interface, Lines 30–35)
```typescript
// BEFORE
export interface DesktopNavProps {
  navLinks: DesktopNavLink[];
  onScroll: (href: string) => void;
  onNavigate: (href: string) => void;
}

// AFTER
export interface DesktopNavProps {
  navLinks: DesktopNavLink[];
  onScroll: (href: string) => void;
  onNavigate: (href: string) => void;
  currentHash: string;
}
```

### Change 4: desktop-nav.tsx (Function signature & state, Lines 42–56)
```typescript
// BEFORE
export function DesktopNav({ navLinks, onScroll, onNavigate }: DesktopNavProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  // ...
  useEffect(() => setMounted(true), []);
  useEffect(() => { /* hashchange listener */ }, [mounted]);
  useEffect(() => { /* pathname sync */ }, [mounted, pathname]);

// AFTER
export function DesktopNav({
  navLinks,
  onScroll,
  onNavigate,
  currentHash: propCurrentHash,
}: DesktopNavProps) {
  const pathname = usePathname();
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  // ...
  const currentHash = propCurrentHash; // Use prop directly — no local state, no useEffect listeners
```

**Why:** Remove all local state management (`mounted`, `currentHash`) and hashchange listeners. Use the prop passed from parent.

### Change 5: desktop-nav.tsx (useMemo dependency, Line 122)
```typescript
// BEFORE
}, [navLinks, pathname, currentHash]);

// AFTER
}, [navLinks, pathname, propCurrentHash]);
```

**Why:** Dependency array should reference the prop name, not the derived local variable.

---

## Manual Test Scenarios

### Scenario 1: Click "Services" in navbar (same page)
**Precondition:** On home page (`/`), no hash currently set

**Steps:**
1. Click "Services" link in DesktopNav dropdown
2. Observe: URL changes to `/#services` in address bar
3. Observe: Page scrolls to Services section
4. Observe: "Services" link in navbar is highlighted **immediately in cyan** (no delay)
5. Observe: Mobile navbar: same behavior (tap "Services", link becomes cyan instantly)

**Expected Result:** ✅ Active link state updates immediately (no flicker)

---

### Scenario 2: Scroll to section and navbar updates
**Precondition:** On home page (`/`), NavbarClient has scroll listeners

**Steps:**
1. User scrolls down page
2. Scroll triggers intersection observer for "Features" section
3. Navbar automatically highlights "Features" link in cyan
4. Continue scrolling to "Dashboard"
5. Navbar updates to highlight "Dashboard"

**Expected Result:** ✅ Navbar active state follows user scroll position (no lag)

---

### Scenario 3: Browser back button (popstate)
**Precondition:** User navigated to `/#services`, then to `/#dashboard`

**Steps:**
1. Click browser back button
2. URL reverts to `/#services`
3. Navbar automatically highlights "Services" (not "Dashboard")

**Expected Result:** ✅ popstate listener in NavbarClient fires, updates `currentHash`, DesktopNav re-renders with correct active state

---

### Scenario 4: Refresh page at specific hash
**Precondition:** User navigates to `/#services`, then refreshes browser

**Steps:**
1. Navigate to `/#services`
2. Press F5 to refresh
3. Page reloads at `/#services`
4. Navbar immediately highlights "Services" on load

**Expected Result:** ✅ On mount, NavbarClient's hashchange listener reads `window.location.hash`, sets state, DesktopNav receives prop and renders with correct active state

---

### Scenario 5: Navigate from `/about#directors` to `/#services`
**Precondition:** User is on `/about#directors` page

**Steps:**
1. Click "Services" in navbar (from About page dropdown)
2. Router navigates to `/` with hash `#services`
3. Page scrolls to Services section
4. Navbar highlights "Services"

**Expected Result:** ✅ Cross-page navigation correctly resets hash and updates navbar active state

---

### Scenario 6: Empty hash on home page
**Precondition:** User is on home page `/` with no hash

**Steps:**
1. Observe navbar on page load
2. No link should be highlighted in cyan (currentHash = "")

**Expected Result:** ✅ All navbar links show default color (no active state)

---

## Edge Cases Handled

| Edge Case | How It's Handled |
|-----------|-----------------|
| User clicks same link twice | `location.hash = hashPart` is idempotent; no duplicate scrolls |
| Mobile navbar closes before hash updates | `closeMenus()` is called before `location.hash` assignment; no race condition |
| Rapid navigation (click link, then back button) | Hashchange events queue; each event updates state correctly |
| Browser doesn't support `popstate` | Fallback: pathname dependency in NavbarClient ensures sync on navigation |

---

## Build Verification

✅ `pnpm build` passes (full production build)
✅ No TypeScript errors in modified files
✅ No prop type mismatches

---

## Regression Testing

**Pre-existing tests should still pass:**
- `components/navigation/__tests__/navbar-client.test.tsx` (if exists)
- `components/navigation/__tests__/desktop-nav.test.tsx` (if exists)
- Any integration tests that verify navbar active link highlighting

---

## Summary

This fix consolidates hash state management to a single location (NavbarClient), eliminating the race condition that caused delayed or inconsistent active link highlighting. The DesktopNav component now receives currentHash as a prop, ensuring synchronous updates whenever the hash changes.

**Key improvement:** Active link styling is now instantaneous and consistent across desktop and mobile viewports.
