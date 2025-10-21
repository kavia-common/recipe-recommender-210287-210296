# Traceability Matrix — Recipe Recommender Frontend (React)

## Requirement IDs to Implementation (Planned)
| Requirement ID | Description | Planned Implementation (Files/Components) |
|---|---|---|
| REQ-FUNC-001 | Submit preferences and fetch recommendations | src/components/SearchForm.jsx, hooks/useRecommendations.js |
| REQ-FUNC-002 | Display recommendations with pagination and sorting | src/components/RecommendationsList.jsx, src/components/RecipeCard.jsx |
| REQ-FUNC-003 | View recipe details | src/components/RecipeDetail.jsx, hooks/useRecipeDetail.js |
| REQ-NFR-001 | Ocean Professional theme and responsive layout | src/styles/theme.css, existing App.css variables, layout components |
| REQ-NFR-002 | Accessibility (WCAG 2.1 AA intent) | ARIA roles/labels in components, tests with axe |
| REQ-SEC-001 | Least privilege API calls over HTTPS | hooks/apiClient.js, request builder |
| REQ-COMP-001 | Audit attribution metadata on API calls | hooks/useAuditMetadata.js, apiClient middleware |
| REQ-VAL-001 | Client-side validation and error handling | utils/validators.js, shared ErrorBanner |

Note: Current repo contains a minimal template (App.js, App.css). The components and hooks listed are planned scaffolds to be created in subsequent tasks.

## Requirement IDs to Tests (Planned)
| Requirement ID | Unit Tests | Integration Tests |
|---|---|---|
| REQ-FUNC-001 | SearchForm validation and submit | Search + Results flow with mocked API |
| REQ-FUNC-002 | RecommendationsList rendering, pagination controls | List + pagination + sort end-to-end |
| REQ-FUNC-003 | useRecipeDetail and RecipeDetail rendering | Route navigation to detail and render |
| REQ-NFR-001 | Theme variable application smoke tests | Visual regression (optional) |
| REQ-NFR-002 | Accessibility props presence | Axe checks on main screens |
| REQ-SEC-001 | API request builder excludes sensitive data | Integration of apiClient with headers |
| REQ-COMP-001 | Audit metadata builder unit tests | Verify headers/body metadata in requests |
| REQ-VAL-001 | Validators for inputs and pagination bounds | Error banners appear on failures |

## Coverage Gaps and Actions
- Gaps
  - Components and hooks not yet implemented (SearchForm, RecommendationsList, RecipeDetail, apiClient, validators).
  - No routing scaffolding in current codebase.
- Actions
  - Implement planned components and hooks with Ocean Professional styling.
  - Add routing with react-router-dom and associated tests.
  - Introduce apiClient with audit metadata injection (userId, action, timestamp).
  - Build validators and error handling patterns; add unit/integration tests.
