# Recipe Recommender Frontend

Modern React SPA implementing the Ocean Professional theme with audit-ready UX for searching and viewing recipes.

## Features
- Ocean Professional theme with Topbar, Sidebar, responsive layout
- RecipeSearchForm with validation (ingredients, dietary, cuisine, max time)
- RecipeList with pagination and sorting; RecipeDetail view
- AuthContext with roles (viewer/editor/admin) and token handling; protected Saved page
- ThemeContext with persisted preference
- apiClient using REACT_APP_API_BASE_URL with auth & audit headers and error normalization
- auditClient posting events to REACT_APP_AUDIT_API_BASE_URL
- Routes: '/', '/recipes', '/recipe/:id', '/saved'
- Jest + React Testing Library tests with API calls mocked

## Getting Started
1. Copy .env.example to .env and set environment variables:
   - REACT_APP_API_BASE_URL
   - REACT_APP_AUDIT_API_BASE_URL (optional)
   - REACT_APP_SITE_URL

2. Install and run:
   - npm install
   - npm start

3. Testing:
   - npm test
   - Coverage target: >= 80% (set CI threshold as needed)

## GxP & ALCOA+ Notes
- Attributable: apiClient attaches x-user-id, x-action, x-timestamp headers; auditClient emits events with userId/action/timestamp.
- Contemporaneous: ISO 8601 timestamps generated at request time.
- Validation: Client-side validation on search inputs; user-friendly error banners.
- Access Control: UI-level route protection for Saved; roles exposed via AuthContext.
- Security: Token stored in session storage for demo only; use secure cookies/SSO in production.
- Error Handling: Normalized error messages; retry options for transient failures.

## Development Notes
- Public interfaces are documented with JSDoc and "PUBLIC_INTERFACE" markers.
- To simulate a login, set sessionStorage "rr_auth" with:
  {
    "user": {"id":"u1","role":"viewer","name":"Demo User"},
    "token": "demo-token"
  }

## Routes
- /            Home (Search + Results)
- /recipes     Search + Results
- /recipe/:id  Recipe detail
- /saved       Protected page (requires user in AuthContext)

## Folder Structure
- src/components/Layout/: Topbar, Sidebar
- src/components/Recipes/: RecipeSearchForm, RecipeList, RecipeDetail
- src/components/Common/: Loading, ErrorBanner
- src/context/: AuthContext, ThemeContext
- src/services/: apiClient, auditClient
- src/__tests__/: Unit tests (API calls mocked)

## Environment Variables
See .env.example for required variables.

## Accessibility
- ARIA labels for main landmarks and form controls
- Visible focus and color contrast via theme tokens
