## Flower Store API (NestJS)

A production-ready NestJS API for a flower e-commerce store. Includes MongoDB, Redis caching, structured logging with Winston, Swagger docs, and Docker setups for development and production.

### Features
- **NestJS 10** with modular architecture
- **MongoDB** via Mongoose
- **Redis** cache and rate limiting ready
- **Swagger** docs at `/api-docs`
- **Winston** logging with daily rotation to `logs/`
- **Docker**: dev services and full production stack

### Requirements
- Node.js 18+
- npm 9+
- Docker and Docker Compose (optional but recommended)

### Getting Started (Local without Docker)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` based on `env.example`:
   ```bash
   cp env.example .env
   ```
   Windows PowerShell:
   ```powershell
   Copy-Item env.example .env
   ```
   Windows CMD:
   ```cmd
   copy env.example .env
   ```
3. Ensure MongoDB and Redis are running locally (see Docker section for easy containers).
4. Start the server:
   ```bash
   npm run start:dev
   ```
5. Open Swagger UI: `http://localhost:3000/api-docs`

### Running with Docker (Production-like)
This will build the app image and run MongoDB and Redis.

```bash
docker compose up -d
```

- App is exposed internally and health-checked; access locally via port mapping if needed (adjust compose or use `docker compose logs -f app`).
- Services:
  - App (Nest) + Healthcheck `GET /api/health`
  - MongoDB `mongo:27017` (mapped to `localhost:27017`)
  - Redis `redis:6379` (mapped to `localhost:6379`)

To stop:
```bash
docker compose down -v
```

### Dev Services Only (MongoDB + Redis)
Use this when running `npm run start:dev` locally but want Docker-managed databases:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Shutdown:
```bash
docker compose -f docker-compose.dev.yml down -v
```

### Environment Variables
See `env.example` for defaults. Key variables:
- `NODE_ENV` (development | production | test)
- `MONGODB_URI` (e.g., `mongodb://localhost:27017/flower_store`)
- `REDIS_HOST`, `REDIS_PORT`

### NPM Scripts
- `npm run start` – start normally
- `npm run start:dev` – start in watch mode with `NODE_ENV=development`
- `npm run start:prod` – run compiled app (`dist/main.js`)
- `npm run build` – compile TypeScript
- `npm run test` / `test:e2e` / `test:cov` – tests and coverage
- `npm run lint` – lint and fix

### API Docs
Swagger UI is served at `GET /api-docs`. Update metadata in `src/main.ts`.

### Logging
Winston transports write daily-rotated logs to `logs/`:
- `http-YYYY-MM-DD.log`
- `error-YYYY-MM-DD.log`

Console logs are formatted with Nest-like output. Configure logger in `src/config/logger/logger.config.ts`.

### Project Structure
```
src/
  common/            # shared utils, dto, constants
  config/logger/     # winston configuration
  modules/
    auth/            # authentication and JWT
    users/           # user domain
```

### Health Check
The compose file checks `GET /api/health`. Ensure an endpoint exists or adjust the healthcheck in `docker-compose.yml`.

### License
UNLICENSED – for internal/learning use. See `package.json`.


