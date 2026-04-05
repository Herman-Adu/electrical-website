# ⚡ QUICK REFERENCE CARD

**Electrical Website - Turnstile Integration (Apr 2026)**

---

## 🎯 YOUR MISSION (New Chat Window)

Implement Turnstile anti-bot protection for contact form + E2E tests + Deploy

**Time Estimate:** 60-90 minutes  
**Status:** All scaffolding ready, zero blockers

---

## 📥 STEP 1: GET CONTEXT (Do This First!)

### A. Copy This Entire File Into New Chat

**Location:** `docs/COMPREHENSIVE_HANDOFF_MASTER_PROMPT_APR2026.md`

```
[Open file → Select ALL → Copy → Paste into new chat as your system message]
```

### B. New Chat Should Display

```
✅ Context loaded: 1000+ lines of system architecture
✅ Ready to begin: Turnstile implementation phase
```

---

## 🔧 STEP 2: RESTORE ENVIRONMENT (One Command!)

```bash
pnpm migration:contact:hydrate:robust
```

**Wait for:**

```
✅ All 11 services up
✅ Bootstrap: "Chromium available"
✅ 11/11 smoke tests pass
✅ 6 memory nodes synced
✅ "Contact migration complete"
```

**Time:** ~2-3 minutes

---

## 🎨 STEP 3: IMPLEMENT TURNSTILE (Follow Master Prompt)

**The master prompt contains everything. Exact steps:**

### 3A. Create File: `components/contact/turnstile-widget.tsx`

```tsx
"use client";
import Script from "next/script";

export function TurnstileWidget() {
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" />
      <div
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-callback="onTurnstileSuccess"
      />
    </>
  );
}
```

### 3B. Update: `components/contact/step-one.tsx`

```tsx
import { TurnstileWidget } from "./turnstile-widget";

export function StepOne() {
  return (
    <div>
      {/* Form fields ... */}
      <TurnstileWidget />
      <button>Next</button>
    </div>
  );
}
```

### 3C. Create Server Action: `app/api/contact/route.ts`

```ts
const TURNSTILE_ENDPOINT =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(TURNSTILE_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: body.turnstileToken,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    return Response.json({ error: "Verification failed" }, { status: 400 });
  }

  // Process form submission...
  return Response.json({ success: true });
}
```

### 3D. Validation in Form

```ts
// Add to form submission
const turnstileToken = window.turnstile?.getResponse();
if (!turnstileToken) {
  return { error: "Please complete the security check" };
}

// Send with form data
await fetch("/api/contact", {
  method: "POST",
  body: JSON.stringify({
    ...formData,
    turnstileToken,
  }),
});
```

**Time:** ~10 minutes

---

## 🧪 STEP 4: RUN E2E TESTS (10 Scenarios Ready!)

```bash
pnpm test:e2e
```

**What it tests:**

1. ✓ Form loads with Turnstile widget visible
2. ✓ Widget iframe renders correctly
3. ✓ Token captured on successful completion
4. ✓ Submit blocked without token
5. ✓ Request sent with token
6. ✓ Siteverify validation called
7. ✓ Success response on valid token
8. ✓ Error response on invalid token
9. ✓ Token expires correctly
10. ✓ Form resets on new attempt

**Expected Output:**

```
✅ 10 tests passing
✅ Coverage > 90%
```

**Time:** ~15 minutes

---

## ✅ STEP 5: VALIDATE BUILD

```bash
pnpm build
```

**Expected:**

```
✅ TypeScript strict mode: 0 errors
✅ ESLint: 0 errors
✅ Build: Complete
```

**Time:** ~5 minutes

---

## 🚀 STEP 6: DEPLOY TO MAIN

```bash
# Commit
git add -A
git commit -m "feat: Turnstile anti-bot integration for contact form"

# Create branch
git checkout -b feat/turnstile-integration
git push origin feat/turnstile-integration

# Create PR
gh pr create --title "Turnstile Anti-Bot Integration" \
  --body "Implements Cloudflare Turnstile v3 for contact form security"

# After review: merge
git merge main
git push
```

**Time:** ~5 minutes

---

## 💾 STEP 7: FINAL MEMORY SNAPSHOT (for next session)

```bash
node scripts/capture-memory-snapshot.mjs
```

**Then run the displayed command to sync to Docker memory**

**Time:** ~2 minutes

---

## ⏱️ TOTAL TIME ESTIMATE

| Task                   | Time       |
| ---------------------- | ---------- |
| Load context + restore | 5 min      |
| Implement Turnstile    | 10 min     |
| E2E tests              | 15 min     |
| Build + validate       | 5 min      |
| Git + deploy           | 5 min      |
| Memory sync            | 2 min      |
| **TOTAL**              | **42 min** |

**Buffer (testing, debug, review):** 20-45 additional minutes  
**Full session estimated:** 60-90 minutes

---

## 📚 KEY FILES (Bookmark These!)

| File                                                  | Purpose                 | Size        |
| ----------------------------------------------------- | ----------------------- | ----------- |
| `docs/COMPREHENSIVE_HANDOFF_MASTER_PROMPT_APR2026.md` | Complete system context | 1000+ lines |
| `docs/NEW_CHAT_START_HERE.md`                         | Quick start guide       | 50 lines    |
| `docs/HANDOFF_DELIVERY_MANIFEST_APR2026.md`           | Delivery proof          | 300 lines   |
| `docker-compose.yml`                                  | 11 MCP services         | 200 lines   |
| `scripts/hydrate-contact-robust.mjs`                  | Auto-restore script     | 150 lines   |
| `agent/mcp/client-wrapper.ts`                         | Robust MCP client       | 287 lines   |
| `e2e/turnstile.spec.ts`                               | E2E test scenarios      | 400+ lines  |
| `components/contact/`                                 | Form components         | -           |
| `app/api/contact/`                                    | Server actions          | -           |

---

## 🔑 ENVIRONMENT VARIABLES

**Server-only (.env.local - NOT in git):**

```
TURNSTILE_SECRET_KEY=sk_live_xxxx...
```

**Public (.env.example - in git):**

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x0xxxxxxxxx...
```

**Get these from:**
https://dash.cloudflare.com/login (free account, no card required)

---

## 🆘 IF SOMETHING BREAKS

### Docker services won't start

```bash
docker-compose down
docker system prune -f
pnpm migration:contact:hydrate:robust
```

### TypeScript errors

```bash
pnpm type-check
```

### Test failures

```bash
pnpm test:e2e --debug
# Opens Playwright inspector
```

### Build fails

```bash
pnpm clean
pnpm build
```

### Memory sync error

```bash
node scripts/mcp-memory-call.mjs search_nodes '{"query":"orchestrator"}'
# Shows if memory is accessible
```

---

## 📞 KEY CONTACTS & RESOURCES

**Your Orchestrator Instance:**

```
http://localhost:3100 (Caddy Gateway)
- /playwright (inspect mode)
- /executor (workflow mode)
- /memory (knowledge graph)
```

**Docker MCP Services (11 total):**

- Playwright + Executor-Playwright (browser automation)
- Memory-Reference (knowledge persistence)
- Sequential-Thinking (reasoning chains)
- GitHub-Official (Pull requests)
- And 6 more support services

**Local Development:**

```
npm run dev
# http://localhost:3000
```

**Playwright Inspector:**

```
pnpm test:e2e --debug
```

---

## ✨ SUCCESS CRITERIA

After completing all 7 steps, you should have:

- ✅ Turnstile widget rendering on contact form
- ✅ Server Action processing tokens + Siteverify validation
- ✅ All 10 E2E tests passing (100% coverage)
- ✅ Build succeeded with zero errors
- ✅ Code merged to main branch
- ✅ Memory snapshot synced for next session
- ✅ Ready for production deployment

**Result:** Contact form now protected + fully tested + documented for next phase

---

## 🎯 NEXT PHASE (After This Completes)

1. **Monitoring & Analytics** - Track form submissions + Turnstile challenges
2. **Rate Limiting** - Add DDoS protection per IP
3. **Advanced Validation** - Multi-field cross-validation rules
4. **Automation Testing** - Integration with GitHub Actions CI/CD
5. **Scaling** - Prepare for production load testing

---

## ✍️ NOTES FOR THIS WINDOW

```
[Your implementation notes, decisions, blockers go here]

- Turnstile widget added to Step 1: ✓
- Server Action created: ✓
- E2E tests: ✓
- Build validation: ✓
- Merge to main: ✓
- Memory synced: ✓
```

---

**Last Updated:** April 5, 2026  
**Status:** 🟢 Ready for Implementation  
**Next Review:** After Turnstile completion

**👉 FIRST ACTION: Copy master prompt into new chat → Then run `pnpm migration:contact:hydrate:robust`**
