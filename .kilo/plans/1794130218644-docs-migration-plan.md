# Plan: Arreglar workflows de GitHub

## Goal
Corregir los workflows de GitHub que están fallando tras la migración de documentación.

## Análisis

### katanakit-js/.github/workflows/wiki-sync.yml
- **Problema**: Referencia `scripts/sync-wiki.mjs` (eliminado) y triggers en `docs/**/*.md` (directorio eliminado).
- **Estado**: Obsoleto. La documentación ahora vive en senseikatana/docs/.
- **Acción**: Eliminar el workflow. Si se quiere mantener el wiki, recrear el script en senseikatana.

### senseikatana/.github/workflows/deploy.yml
- **Problema**: Solo despliega `web/dist`. No construye ni despliega la documentación VitePress.
- **Acción**: Añadir paso para construir docs y desplegar `docs/.vitepress/dist` a Cloudflare Pages (proyecto `senseikatana-docs`).

### senseikatana/.github/workflows/sync-main.yml
- **Problema**: Probablemente funciona. Sync de dev → main.
- **Acción**: Sin cambios necesarios. Verificar que `main` se actualiza correctamente.

## Steps

1. **Eliminar** `katanakit-js/.github/workflows/wiki-sync.yml` (obsoleto).
2. **Actualizar** `senseikatana/.github/workflows/deploy.yml` para:
   - Construir docs con `bun run docs:build`
   - Desplegar docs a Cloudflare Pages (proyecto `senseikatana-docs`)
   - Mantener deploy de `web/dist` (sitio Astro)
3. **Verificar** `senseikatana/.github/workflows/sync-main.yml` funciona sin cambios.

## Risks
- Cloudflare Pages project `senseikatana-docs` debe existir (crear si no existe).
- Secrets `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` deben estar configurados en senseikatana.
- El workflow de docs en senseikatana requiere que katanakit-js esté disponible (clonado como submódulo o sibling).

## Validation
- Workflows pasan en GitHub Actions.
- Docs se despliegan a senseikatana.com/docs/.
- Sitio Astro se despliega a senseikatana.com.