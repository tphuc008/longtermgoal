# MyPlan OS

A clean, shadcn-inspired goal and planning dashboard. Built with React, TypeScript, Vite, Radix UI, Lucide and Recharts.

## Features

- Long-term goals with measurable outcome tracking
- Linked projects, milestones and tasks
- Today dashboard, task Inbox and quick capture
- Weekly planner with scheduled dates separate from due dates
- Weekly reviews and progress analytics based on real data
- Responsive layout, dark mode, demo workspace, import/export JSON

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Persistence and privacy

**This is a browser-local MVP.** Your changes are saved in the browser's `localStorage`. They do not sync between devices and are lost if site storage is cleared. Use **Export data** from Settings to back up your workspace. The starter workspace is example data; use **Start fresh** in Settings when ready. Do not store passwords or highly sensitive information.

For cross-device synchronization and authentication, the next version can add Supabase with Row Level Security and an import/migration flow.

## GitHub Pages

The repository includes `.github/workflows/deploy.yml`. For a live site, first enable **Settings > Pages > Build and deployment > Source: GitHub Actions**, then manually start **Actions > Build and deploy to GitHub Pages > Run workflow**. Every push runs a production build check; Pages deployment runs on manual dispatch only. The workflow uses Vite's `/longtermgoal/` production base path. The site URL will normally be `https://tphuc008.github.io/longtermgoal/` *if GitHub Pages is enabled and permitted for this repository*. Private repository Pages availability depends on GitHub plan/settings. Repo publication and public site deployment are distinct steps.

## Notes

- Goal progress represents measurable outcome (`current / target`), not a task-completion score.
- Date scheduling is distinct from due date. Weekly plans display scheduled tasks.
- Dashboard metrics and charts use saved data rather than fabricated values.
- No backend, AI, notification engine, or calendar sync is included in this MVP.