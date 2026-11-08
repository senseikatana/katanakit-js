# Plan: rrhh-suite — Suite de RRHH multi-tenant

## Goal
Crear una suite de RRHH reutilizable y multi-tenant (Fundación Privada Onada + otras empresas) con módulos de: fichaje (timesheet), vacaciones/permisos, empleados, nóminas (payslips) y finanzas.

## Stack (locked)
- **Framework**: Astro (SSR) + Cloudflare Pages/D1
- **Auth**: better-auth (como salouextranet)
- **DB**: Cloudflare D1 (SQLite) con migraciones
- **Toolkit**: katanakit-js (HTTP, validación, safe results, etc.)
- **UI**: Tailwind CSS 4 + KatanaKit UI (`packages/ui`)
- **ORM**: Drizzle ORM (prisma-next.md sugiere Prisma 8, pero D1 + Drizzle es más maduro para edge)

## Architecture

### Multi-tenant
- `tenant_id` en todas las tablas de dominio
- Aislamiento por tenant en todas las queries
- Admin global (super-admin) + admin por tenant

### Modules
1. **Empleados** — directorio, roles, departamentos, activo/inactivo
2. **Fichaje** — clock in/out, correcciones, reportes, CSV export
3. **Vacaciones/Permisos** — tipos de ausencia, solicitudes, aprobación, saldos
4. **Nóminas** — conceptos, generación, PDF, estado (draft/published)
5. **Finanzas** — gastos, facturas, presupuestos, reportes

### Data Model (D1 / SQLite)
- `tenants` (id, name, slug, plan, created_at)
- `users` (id, tenant_id, email, name, role, department_id, employee_code, phone, active)
- `departments` (id, tenant_id, code, name)
- `time_entries` (id, tenant_id, user_id, kind, recorded_at, source, note)
- `time_entry_corrections` (id, tenant_id, user_id, entry_id, requested_kind, requested_at, reason, status, reviewed_by, reviewed_at)
- `leave_types` (id, tenant_id, code, name, unit, annual_minutes, sort_order, active)
- `leave_requests` (id, tenant_id, user_id, type_id, start_date, end_date, amount_minutes, reason, status, reviewed_by, reviewed_at)
- `payroll_concepts` (id, tenant_id, code, name, kind)
- `payrolls` (id, tenant_id, user_id, period, gross_cents, net_cents, total_deductions_cents, status, file_key)
- `payroll_items` (id, payroll_id, concept_id, amount_cents, base_cents, sort_order)
- `expenses` (id, tenant_id, user_id, category, amount_cents, description, date, status)
- `invoices` (id, tenant_id, client_name, amount_cents, date, due_date, status)
- `budgets` (id, tenant_id, name, amount_cents, period, category)
- `audit_log` (id, tenant_id, actor_id, action, entity, entity_id, metadata, created_at)

### Auth & Roles
- better-auth con email/password + Google + GitHub
- Roles: super-admin (cross-tenant), admin (tenant), manager (department), employee
- Role claims via better-auth admin plugin
- Routes: `/` (dashboard), `/me`, `/timesheet`, `/payslips`, `/account`, `/expenses`, `/invoices`, `/budgets`, `/settings`, `/admin/*`

### Routes
- `/` → Dashboard (KPIs, charts)
- `/me` → Personal panel
- `/timesheet` → Fichaje
- `/payslips` → Nóminas
- `/account` → Perfil
- `/expenses` → Gastos
- `/invoices` → Facturas
- `/budgets` → Presupuestos
- `/settings` → Configuración (admin)
- `/admin/tenants` → Gestión de tenants (super-admin)
- `/admin/users` → Gestión de usuarios

## Steps

### Phase 1: Scaffold
1. Crear repo `rrhh-suite` (o workspace en senseikatana)
2. Scaffold Astro + Cloudflare D1 + better-auth
3. Configurar katanakit-js como dependencia
4. Setup Tailwind CSS 4 + KatanaKit UI
5. Crear migraciones D1 base (tenants, users, departments)

### Phase 2: Auth & Multi-tenant
1. better-auth con admin plugin
2. Middleware de tenant resolution (por subdominio o path)
3. Role-based access control
4. Signup flow con bootstrap (primer admin)

### Phase 3: Empleados
1. CRUD de empleados
2. Departamentos
3. Roles y permisos

### Phase 4: Fichaje
1. Clock in/out
2. Correcciones (solicitar, aprobar/rechazar)
3. Reportes y CSV export

### Phase 5: Vacaciones/Permisos
1. Tipos de ausencia
2. Solicitudes y aprobación
3. Saldos y reportes

### Phase 6: Nóminas
1. Conceptos de nómina
2. Generación de nóminas
3. PDF generation
4. Estado draft/published

### Phase 7: Finanzas
1. Gastos (expenses)
2. Facturas (invoices)
3. Presupuestos (budgets)
4. Reportes y dashboard

### Phase 8: Polish
1. Dashboard con KPIs y charts
2. i18n (es/en/ca)
3. Tests (Vitest + Playwright)
4. Deploy a Cloudflare Pages

## Reference
- salouextranet: https://github.com/senseikatana/salou-extranet (Astro + D1 + better-auth, fichaje/vacaciones/nóminas)
- dock-dashboard: https://github.com/senseikatana/dock-dashboard (React + Firestore, timesheet/payslips/expenses)
- katanakit-js: toolkit para HTTP, validación, safe results

## Risks
- Multi-tenant añade complejidad a todas las queries (tenant_id filtering)
- D1 tiene límites de tamaño y performance (SQLite)
- better-auth con D1 requiere adaptador específico
- PDF generation en edge (Cloudflare) puede ser limitado

## Validation
- `bun run check` (lint + typecheck + tests)
- `bun run build` (Astro build)
- `bun run test:e2e` (Playwright)
- Deploy a Cloudflare Pages preview

## Open Questions
- Nombre final del producto (rrhh-suite, onada-hr, etc.)
- ¿Se despliega como subdominio o path en senseikatana.com?
- ¿Se necesita API pública o solo UI?