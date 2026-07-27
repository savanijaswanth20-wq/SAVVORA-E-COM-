---
name: supabase-server
description: Guidelines and best practices for building APIs and server-side request handlers using @supabase/server.
---

# Supabase Server Skill (@supabase/server)

## Overview
Use `@supabase/server` to build secure API endpoints, verify user authentication tokens/JWTs, and interact with Supabase services on the server.

## Environment Setup
Ensure the following variables are set in your environment:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_JWKS_URL`

## Key Patterns
- Use `SUPABASE_SECRET_KEY` for administrative server-side tasks requiring service-role privileges.
- Verify JWT tokens against `SUPABASE_JWKS_URL` for authenticated endpoints.
- Return appropriate status codes (`401` for unauthorized, `403` for forbidden).
