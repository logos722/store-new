# Production deployment

The server infrastructure and full Russian runbook live in the backend repository under `deploy/RUNBOOK.md`.

- Use Node.js from `.nvmrc`; `npm ci`, `npm run lint`, `npm run build`, `npm run typecheck` must pass.
- Docker creates Next.js standalone output and runs `node server.js` as user `node`. A live backend is not required at build time.
- Public `NEXT_PUBLIC_*` values are Docker build arguments, never secrets. Change them by rebuilding the image. The workflow exposes analytics IDs as repository Variables, disabled by default.
- `API_BASE_URL` is server runtime configuration (`http://backend:5000` in Compose). It is not exported through next.config. Browsers use same-origin `/api/...`.
- Nginx routes `/api/` and `/images/` to Express. Existing Next route handlers remain useful for local frontend development, where `API_BASE_URL=http://localhost:5000`. Local auth/images need an equivalent reverse proxy.
- Health endpoint: `/health`. Product/category SSR awaits Next.js 15 Promise params and calls the internal backend instead of fetching through the public domain.
- CI publishes `ghcr.io/logos722/store-new:<commit SHA>` after checks, deploys its digest over SSH with a pinned host key, and does not stop the entire Compose project.
- Configure the `production` GitHub Environment Secrets `SSH_HOST`, `SSH_USER=gelion-deploy`, `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`. Read the backend runbook before the first release; rotate the key exposed by the former debug workflow step.
- Security overrides pin patched PostCSS/minimatch transitives while remaining on Next.js 15.5. Recheck `npm audit` when updating lockfiles.
