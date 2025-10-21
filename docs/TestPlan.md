# Recipe Recommender Web App - Test Plan (Frontend)

## Introduction
This Test Plan defines the verification and validation approach for the Recipe Recommender frontend (React). It is aligned with the Product Requirements Document and Architecture Document to ensure the implementation meets functional and non-functional requirements while adhering to GxP and ALCOA+ data integrity principles.

- Related documents:
  - PRD: ./PRD.md
  - Architecture: ./Architecture.md
  - Compliance & Validation: ./Compliance_Validation_Plan.md
  - Test Strategy Overview: ./Test_Strategy.md
  - Traceability Matrix: ./Traceability_Matrix.md

## Scope
The Test Plan covers the React frontend UI, state management, routing, client-side validation, API integration (mocked), audit attribution metadata emission, accessibility, and performance behaviors observable in the client. It includes unit tests, integration tests, e2e/smoke tests (where applicable), and validation tests for GxP-critical paths.

### In-Scope
- Search form validation and submission flows
- Listing (pagination, sorting) and detail views
- API client behavior (headers, error normalization)
- Audit event emission behavior (non-blocking)
- UI error handling (ErrorBanner) and empty states
- Theming and layout basic behaviors
- Accessibility (key pages and controls)
- Role-aware UI elements (protected /saved route visibility)
- Basic performance checks (debounce pattern readiness, pagination rendering)

### Out-of-Scope
- Backend business logic, data persistence, and database auditing
- Full e-signature flows (planned for future critical operations)
- Offline/PWA features
- Non-frontend infrastructure performance and load testing

## Test Strategy
Testing follows a risk-based, layered strategy focusing on GxP-critical validations, functional correctness, and maintainability.

### Unit Testing
- Frameworks: Jest, React Testing Library
- Targets:
  - Validation logic in RecipeSearchForm.jsx
  - apiClient.js header injection and error normalization
  - auditClient.js emission (mocked fetch)
  - Components rendering logic (Loading, ErrorBanner)
- Goals:
  - Lines/branches coverage >= 80% across frontend logic
  - Cover happy paths, edge cases, null/empty handling, and error scenarios

### Integration Testing
- Frameworks: Jest, React Testing Library with MemoryRouter
- Targets:
  - Search form + RecipeList integration for pagination, sorting
  - Routing between list and detail pages (routes.jsx)
  - Auth-protected route accessibility for /saved
  - Accessibility smoke checks (axe) on major screens
- Emulate API via mocks; focus on UI orchestration and data handling

### End-to-End (E2E) / Smoke
- Framework: Playwright (recommended; introduce as pipeline smoke tests)
- Targets:
  - Load home page, fill search form, see results (mocked or dev backend)
  - Navigate to a recipe detail by ID
  - Verify error banner on network failure
- Note: E2E can be staged as smoke tests and expanded later

### Accessibility Testing
- Tools: axe (jest-axe or react-axe in tests)
- Targets:
  - Home/Search, Recipes List, Recipe Detail
  - Labeling, roles, focus indicators, color contrast
- Criteria: No critical a11y violations

### Performance Testing
- Scope: Client-perceived performance
- Checks:
  - Results pagination does not cause excessive DOM updates
  - Optional: Lighthouse pass on built artifacts
  - Debounce readiness to limit request rate

### Security Testing (Frontend)
- Checks:
  - No secrets in client bundle
  - Least-privilege headers usage (no over-scoped tokens)
  - Avoid durable storage for sensitive tokens (session-only in demo; secure cookies/SSO in production)
  - Role-aware UI visibility only; backend remains source of truth

## Test Environments
- Local development: http://localhost:3000 (frontend)
- API base URL via environment:
  - REACT_APP_API_BASE_URL
  - REACT_APP_AUDIT_API_BASE_URL
- CI: Headless test execution with mocked APIs; optional smoke tests against a dev backend if available
- CORS: Backend must include http://localhost:3000 for local testing

## Test Data Management
- Use synthetic recipe data (no PII)
- Fixtures:
  - Recommendation list items with typical and edge values (long titles, missing images, extreme prep times)
  - Recipe details with missing optional fields to test null handling
- Negative test data:
  - Invalid dietary/cuisine values
  - Excessive ingredients length
  - Out-of-range max time

## Roles and Responsibilities
- QA Engineer: Owns test planning, scenario design, and execution; maintains test suites and reports
- Developers: Maintain unit/integration tests for their components/services; fix defects
- Compliance Reviewer: Verifies traceability, validation evidence, and GxP controls (audit metadata, input validation)
- Release Manager: Reviews test results, coverage, defects, and gate checklist prior to release

## Test Entry and Exit Criteria
### Entry Criteria
- Implemented features are code-complete and buildable
- PRD and Architecture documents available
- Unit test scaffolding in place with mocks
- Environment variables configured for test

### Exit Criteria
- All planned tests executed with pass rate ≥ 95% for non-flaky tests
- Unit test coverage ≥ 80% lines/branches
- No critical or high-severity open defects in GxP-critical areas
- Accessibility checks with no critical violations on key screens
- Release gate checklist items satisfied

## Coverage Goals
- Unit tests: ≥ 80% lines and branches for components, services, and validation logic
- Integration tests: Core user journeys, routing transitions, and audit metadata checks
- Accessibility: Smoke coverage across primary pages
- Validation: GxP-critical validations executed for input, headers, and audit metadata

## Requirement Traceability (PRD to Tests)
Representative mapping; see detailed matrix in ./Traceability_Matrix.md.

| PRD Requirement | Implementation | Test Coverage |
| --- | --- | --- |
| Search recipes (REQ-FUNC-001) | RecipeSearchForm.jsx, RecipeList.jsx | RecipeSearchForm.test.jsx, RecipeList.test.jsx |
| View recipe detail (REQ-FUNC-002) | RecipeDetail.jsx | apiClient.test.js (headers), add detail tests as needed |
| Validation controls (REQ-VAL-001) | RecipeSearchForm.jsx validation | RecipeSearchForm.test.jsx |
| Audit attribution (REQ-COMP-001) | apiClient.js, auditClient.js | apiClient.test.js; audit client mock assertions |
| Accessibility (REQ-NFR-002) | Components with ARIA | axe checks in tests |

## Risk-Based Prioritization
- High: Input validation integrity; audit attribution metadata presence; error handling pathways
- Medium: Pagination/sorting consistency; routing stability
- Low: Theming cosmetic regressions; non-critical layout/styling

## Defect Management Workflow
- Tools: GitHub Issues (or Jira)
- Severity Levels:
  - Critical: Data integrity/GxP violation, security exposure, or crash preventing core flow
  - High: Functional blocking issues without workaround
  - Medium: Non-blocking defects affecting UX or secondary flows
  - Low: Cosmetic issues, minor usability concerns
- Workflow:
  1. Log defect with steps, environment, version, and evidence
  2. Triage with severity and priority
  3. Assign to developer; include test to reproduce
  4. Fix and submit PR with tests
  5. Verify fix and close with reference to test case IDs

## Reporting Cadence
- CI run reports per PR: unit/integration results and coverage summary
- Weekly QA status: coverage trends, open defects, risk items
- Release readiness report: pass/fail summary, coverage metrics, open critical/high defects, gate checklist status

## Tooling
- Unit/Integration: Jest, React Testing Library
- E2E: Playwright (recommended for smoke scenarios)
- Accessibility: axe (jest-axe)
- Linting: ESLint (with jsx-a11y), Prettier
- Performance: Lighthouse (optional), basic render benchmarks if needed
- Coverage: jest --coverage

## Test Scenarios
### User Journey: Search and View Results
- Preconditions: App loads; API base set; mock returns data
- Steps:
  1. Enter valid ingredients; select dietary and cuisine; optional max time
  2. Submit and expect API call to /recommendations with metadata
  3. See list of results; verify pagination and sorting changes trigger further calls
  4. Update filters and verify refined results
- Expected:
  - Validation passes for valid inputs
  - API called with x-user-id, x-action, x-timestamp headers (or metadata field)
  - Results render with correct counts
  - No critical a11y violations

### User Journey: View Recipe Detail
- Steps:
  1. Navigate to /recipe/:id
  2. Expect audit emission event recipe_view
  3. Expect GET /recipes/:id with audit metadata
- Expected:
  - Detail view shows ingredients, steps, and nutrition (if provided)
  - Graceful handling of missing optional fields

### Validation Points
- Invalid inputs:
  - Empty ingredients → error message
  - Dietary or cuisine not in whitelist → error message
  - Max time <= 0 or > 600 → error message
- Boundary:
  - Ingredients length = 500 (pass); 501 (fail)
  - Page bounds: cannot go below 0; correct disable of Prev button on first page

### Audit Logging
- Search submit → auditClient.emit with event=search_submit; metadata includes userId/action/timestamp
- Recipe detail view → auditClient.emit with event=recipe_view

### Error Handling
- API network error → ErrorBanner appears with Retry button; onRetry triggers fetch
- 4xx response → Normalized error message shown; no technical stack to user

## Example Test Cases
### Unit: apiClient headers
- Title: Sends auth and audit headers in GET
- Arrange: Mock fetch 200; set token via __setAuthSnapshotProvider; call apiClient.get('/recipes/1', { userId, action, timestamp })
- Assert: fetch called with Authorization, x-user-id, x-action, x-timestamp

### Unit: Search form validation
- Title: Requires ingredients
- Steps: Submit empty form
- Assert: Error text “Please enter at least one ingredient” visible

### Integration: List pagination
- Title: Loads first page then navigates to second page
- Steps: Mock first then second page; click Next
- Assert: Item counts update from 10 to remaining; controls enable/disable state correct

### Integration: Sorting change
- Title: Changing sort triggers fetch
- Steps: Change sort select to title
- Assert: apiClient.post called with sort=title

### E2E: Basic smoke (Playwright)
- Title: Search and see results
- Steps: Visit /, fill form, click submit
- Assert: Results rendered; at least one “View details” link

### Accessibility: Axe checks
- Title: No critical violations on Search page
- Steps: Render form and run axe
- Assert: 0 critical issues

## Test Execution and Schedule
- Per-commit CI: lint + unit/integration tests with coverage
- Daily (or per-merge) smoke E2E (optional) on a stable environment
- Pre-release: Full suite + accessibility checks + coverage verification

## Release Gate Checklist (Testing View)
- [ ] Unit tests ≥ 80% coverage and passing
- [ ] Integration tests for main journeys passing
- [ ] Accessibility smoke checks pass with no critical violations
- [ ] Audit metadata verified on API calls (headers or metadata field)
- [ ] Error handling validated for network and 4xx/5xx scenarios
- [ ] No open Critical/High GxP-related defects
- [ ] Traceability Matrix updated with test references
- [ ] CI pipeline green and reports archived

## Maintenance and Continuous Improvement
- Keep tests in step with feature changes; enforce coverage thresholds
- Expand E2E coverage for high-risk workflows
- Review accessibility regularly as UI evolves
- Periodically review audit emission coverage with compliance stakeholders

## Appendix: Linkage to Codebase (Current Files)
- src/components/Recipes/RecipeSearchForm.jsx
- src/components/Recipes/RecipeList.jsx
- src/components/Recipes/RecipeDetail.jsx
- src/components/Common/ErrorBanner.jsx
- src/services/apiClient.js
- src/services/auditClient.js
- src/context/AuthContext.jsx
- src/routes.jsx

