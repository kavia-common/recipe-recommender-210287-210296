# Software Architecture Document (SAD) — Recipe Recommender Frontend (React)

## System Context
The frontend is a React SPA that interacts with a backend via REST APIs to retrieve recipe recommendations and details. The frontend does not store sensitive user data and relies on the backend for business logic, persistence, and audit trail recording. Dependencies include:
- Backend REST API: Recommendation search and recipe detail endpoints
- food_recipe_database: Indirect dependency through backend

High-level context:
- Browser (User) → React Frontend → REST API (Backend) → Recipe Database

## Constraints and Assumptions
- React 18 environment using create-react-app (present in repo).
- Minimal dependencies; theming via CSS variables and Ocean Professional styling.
- Authentication and authorization are assumed to be provided by the hosting/back-end context; UI reads user context if available to attach attribution metadata.
- Network calls performed over HTTPS; no external credentials included in the frontend repo.

## UI Architecture
- Application Shell
  - Top navigation bar: quick actions (theme toggle as present, later: filters access)
  - Sidebar: navigation (Home/Search, Favorites [future], Settings)
  - Main area: lists and details
- Routing (planned)
  - /: Search and Recommendations
  - /recipe/:id: Recipe Detail
- State Management
  - React hooks and component-level state for inputs and UI.
  - Lightweight custom hooks for API calls, caching, and debounced search.
- Theming (Ocean Professional)
  - CSS variables for colors: primary #2563EB, secondary #F59E0B, background #f9fafb, surface #ffffff, text #111827
  - Subtle shadows and rounded corners; smooth transitions.

## Data Flow
### Inputs and Preferences
- User enters ingredients, dietary preferences, allergens, cuisine, and meal type.
- Client-side validation ensures correct types, allowed values, and non-malicious input.

### API Calls
- Recommendations: POST/GET /api/recommendations with payload { ingredients, preferences, allergens, cuisine, mealType, pagination, sort }.
- Recipe Detail: GET /api/recipes/:id.

### Caching and Pagination
- Cache last N query results in memory (hook state) keyed by parameters.
- Support pagination params (page, size) and sorting (e.g., relevance, prepTime).

### Event Attribution
- For each API call, include metadata if available:
  - x-user-id: user identifier from auth context
  - x-action: READ for fetches; CREATE/UPDATE reserved for future critical ops
  - x-timestamp: ISO 8601 timestamp
- If headers are not supported, include in request body metadata field for audit by backend.

## Security and Access Control
- Role-based checks at UI level (conditional visibility) where applicable; definitive checks to be enforced by backend.
- Avoid storing tokens in localStorage; rely on secure cookies/session where applicable.
- Enforce least privilege on API usage (limited scopes).

## Error Handling Strategy
- Centralized error boundary for catastrophic render errors.
- API hook with try/catch and standard error object normalization.
- User-facing banners/toasts for errors with retry actions for transient failures.
- Graceful empty states when no results are found.

## Audit Trail Strategy
- Frontend attaches user and action metadata to requests to enable backend audit logging.
- Timestamps generated using new Date().toISOString().
- Critical operations (future e-signature scenarios) prompt user confirmations and pass signature assertions to backend.

## Scalability and Performance
- Debounced inputs to reduce request volume.
- Pagination and incremental rendering of results.
- Simple in-memory caching for responsiveness.
- Static asset optimization via CRA build pipeline.

## Operational Considerations
- CI should run lint, unit tests, integration tests (frontend), and accessibility checks.
- Environment configurations (API base URL) expected from hosting environment (e.g., env var injection at build/deploy).
- Feature flags (future) can be implemented using environment variables or a small configuration layer.

## Component Overview (Planned)
- Components
  - SearchForm: inputs and validation
  - RecommendationsList: displays results with pagination, sorting
  - RecipeCard: summary information
  - RecipeDetail: detailed view
  - FiltersPanel: refine controls
  - ErrorBanner / Toast: error and status
- Hooks
  - useRecommendations(params): fetch, cache, paginate, and attribute events
  - useRecipeDetail(id): fetch detail and attribute events
  - useDebounce(value, delay): input debouncing
  - useAuditMetadata(): provides userId, timestamp, action

## Interfaces (REST)
Backend base: http://localhost:4000

Implemented endpoints (per backend/openapi.yaml):
- POST /auth/login
  - body: { email, password }
  - 200: { token, user { id, email, roles[], name } }
- GET /users/me (auth)
  - 200: { id, email, name, roles[] }
- GET /recipes/search
  - query: q, cuisine, dietary, maxTime, page=1, pageSize=10
  - 200: { items: Recipe[], total, page, pageSize }
- GET /recipes/{id}
  - 200: Recipe
- POST /recipes/{id}/save (auth, e-sign when enabled)
  - body: { passwordReentry?, reason? }
  - 200: { saved: boolean, esign?: string }
- GET /users/me/saved (auth)
  - 200: { items: Recipe[] }
- POST /audit/log (auth)
  - body: { action, entity, entityId?, beforeState?, afterState?, reason? }
  - 201: Logged

Frontend consumes the API using:
- REACT_APP_API_BASE_URL=http://localhost:4000
- REACT_APP_AUDIT_API_BASE_URL=http://localhost:4000
- CORS_ORIGIN on backend must include http://localhost:3000

## Actionable Next Steps
- Implement routing and component scaffolds.
- Build hooks for API calls with validation and audit attribution headers or metadata.
- Implement CSS theme tokens per Ocean Professional.
- Add tests and CI configuration for coverage and accessibility checking.
