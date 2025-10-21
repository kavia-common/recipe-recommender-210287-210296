# Traceability Matrix — Recipe Recommender Frontend (React)

## Requirement IDs to Implementation (Actual)
| Requirement ID | Description | Implementation (Files/Components) |
|---|---|---|
| REQ-FUNC-001 | Search recipes | frontend: src/components/Recipes/RecipeSearchForm.jsx, RecipeList.jsx; backend: GET /recipes/search |
| REQ-FUNC-002 | View recipe detail | frontend: src/components/Recipes/RecipeDetail.jsx; backend: GET /recipes/{id} |
| REQ-FUNC-003 | Save recipe (with e-sign when enabled) | frontend: uses apiClient.post('/recipes/:id/save'); backend: POST /recipes/{id}/save with REQUIRE_ESIGN_FOR_SAVE |
| REQ-SEC-001 | Auth & RBAC | backend: JWT + RBAC middleware; frontend: AuthContext |
| REQ-COMP-001 | Audit trail | backend: audit middleware + /audit/log; frontend: auditClient emits |
| REQ-VAL-001 | Input validation | backend: Zod validators; frontend: form validations |
| REQ-NFR-001 | Ocean Professional theme | frontend: App.css, layout components |
| REQ-NFR-002 | Accessibility hints | frontend: components include ARIA labels |

## Requirement IDs to Tests (Actual)
| Requirement ID | Unit Tests | Integration Tests |
|---|---|---|
| REQ-FUNC-001 | frontend: src/__tests__/RecipeSearchForm.test.jsx | backend: tests/integration/recipes.int.test.ts (search) |
| REQ-FUNC-002 | frontend: src/__tests__/RecipeList.test.jsx | backend: tests/integration/recipes.int.test.ts (detail) |
| REQ-FUNC-003 | — | backend: tests/integration/recipes.int.test.ts (save) |
| REQ-SEC-001 | backend: tests/unit/authService.test.ts | backend: tests/integration/auth.int.test.ts |
| REQ-COMP-001 | — | backend: integration tests verify audit entries |
| REQ-VAL-001 | backend: tests/unit/validation.test.ts | covered in integration tests |

## Config and Endpoints
- Frontend env:
  - REACT_APP_API_BASE_URL=http://localhost:4000
  - REACT_APP_AUDIT_API_BASE_URL=http://localhost:4000
- Backend env:
  - CORS_ORIGIN=http://localhost:3000
  - DATABASE_URL=postgres://postgres:postgres@localhost:5432/recipes
- Endpoints in use:
  - POST /auth/login
  - GET /users/me
  - GET /recipes/search
  - GET /recipes/{id}
  - POST /recipes/{id}/save
  - GET /users/me/saved
  - POST /audit/log
