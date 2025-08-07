# Meilisearch Explorer

A modern, production-ready UI to explore and manage your Meilisearch instance.
Built with Next.js, TypeScript, and Tailwind CSS.

- Elegant glassmorphism UI with gradients and animations
- Index management: create, view, delete
- Document management: add, browse, delete
- Search interface with pagination and per-page controls
- Index settings editor (searchable, filterable, sortable, ranking rules, synonyms, stop-words, distinct, typo)
- i18n with English and French + in-app locale switcher

## Image Details
- Base: node:20-alpine
- Exposed port: 3000
- Default command: `npm run start -p 3000`

## Environment Variables
- `NEXT_PUBLIC_MEILISEARCH_HOST` (default: `http://localhost:7700`)
- `NEXT_PUBLIC_MEILISEARCH_API_KEY` (default: empty)

Set these to point the UI to your Meilisearch server.

## Quick Start
Run the UI only (expects an existing Meilisearch):

```bash
# Pull the image (replace org/name:tag with your repository)
docker pull <org>/<repo>:<tag>

# Run the container
docker run --rm \
  -p 3000:3000 \
  -e NEXT_PUBLIC_MEILISEARCH_HOST=http://localhost:7700 \
  -e NEXT_PUBLIC_MEILISEARCH_API_KEY= \
  <org>/<repo>:<tag>
```

Open http://localhost:3000 and configure the host/API key in the app if needed.

## Docker Compose Example (UI + Meilisearch)

```yaml
version: "3.9"
services:
  app:
    image: <org>/<repo>:<tag>
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_MEILISEARCH_HOST: http://meilisearch:7700
      NEXT_PUBLIC_MEILISEARCH_API_KEY: ""
    depends_on:
      - meilisearch

  meilisearch:
    image: getmeili/meilisearch:v1.10
    restart: unless-stopped
    environment:
      MEILI_NO_ANALYTICS: "true"
      MEILI_ENV: development
    command: ["meilisearch", "--no-analytics", "--env", "development", "--http-addr", "0.0.0.0:7700", "--db-path", "/meili_data"]
    ports:
      - "7700:7700"
    volumes:
      - meili_data:/meili_data

volumes:
  meili_data:
```

Then visit http://localhost:3000.

## Security Notes
- If your Meilisearch requires an API key, set `NEXT_PUBLIC_MEILISEARCH_API_KEY` in the environment.
- Consider placing this UI behind a reverse proxy with authentication in production.

## License
MIT
