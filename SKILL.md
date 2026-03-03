---
name: cdp-browser
description: Select and install one cdp-browser skill variant (npm, npx, bun, or bunx) for controlling Chrome/Chromium through CDP from coding agents.
---

# cdp-browser skills

This package includes multiple skill variants grouped by usage pattern. Choose one based on how your repo runs `cdp-browser`:

Project dependency variants:

- `skills/project/npm/cdp-browser/SKILL.md`  
  Uses `npm exec cdp-browser -- ...`.
- `skills/project/bun/cdp-browser/SKILL.md`  
  Uses `bun run cdp-browser ...`.

Global variants:

- `skills/global/npx/cdp-browser/SKILL.md`  
  Uses `npx cdp-browser ...`.
- `skills/global/bunx/cdp-browser/SKILL.md`  
  Uses `bunx cdp-browser ...`.

Install exactly one variant into your repo as:

`.agents/skills/cdp-browser/SKILL.md`

For project dependency variants (`npm` / `bun`), symlink is recommended:

```bash
mkdir -p .agents/skills/cdp-browser
ln -sf "$(pwd)/node_modules/cdp-browser/skills/project/npm/cdp-browser/SKILL.md" \
  ".agents/skills/cdp-browser/SKILL.md"
```

(Use `skills/project/bun/cdp-browser/SKILL.md` for Bun project dependency usage.)
