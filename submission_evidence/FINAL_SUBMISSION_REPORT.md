# IBM Skills Network Final Project: Book Review Application
## Comprehensive Task Completion and Verification Report

### Executive Summary
- **Project Name:** Express Book Reviews Application
- **Student GitHub Username:** `dishant1313`
- **Forked Repository:** `https://github.com/dishant1313/expressBookReviews`
- **Official Upstream Parent:** `https://github.com/ibm-developer-skills-network/expressBookReviews`
- **Default Branch:** `main`
- **Direct File URL (Evaluator Inspection):** `https://github.com/dishant1313/expressBookReviews/blob/main/final_project/router/general.js`
- **Status:** All 10 Core Application Tasks and 4 Asynchronous Axios Tasks Fully Implemented, Tested (22/22 Tests Passing), and Verified.

---

### Task Completion Checklist & Real Verification Results

| # | Task / Requirement | Implementation Location | Verification Evidence | Status |
|---|---|---|---|---|
| 1 | **Official IBM Repository Fork Verified** | GitHub API (`/repos/dishant1313/expressBookReviews`) | Verified via GitHub REST API: `fork: true`, `parent: ibm-developer-skills-network/expressBookReviews` (See `submission_evidence/githubrepo`). | **VERIFIED COMPLETE** |
| 2 | **Retrieve All Books (Task 1 & Task 10)** | `final_project/router/general.js` (`GET /`) | Retrieves all 10 books using Axios with Async-Await. HTTP status `200 OK`. (See `submission_evidence/getallbooks`). | **VERIFIED COMPLETE** |
| 3 | **Search Books by ISBN (Task 2 & Task 11)** | `final_project/router/general.js` (`GET /isbn/:isbn`) | Retrieves matching book by ISBN parameter via Axios async helper. Handles nonexistent ISBN with `404 Not Found`. (See `submission_evidence/getbooksbyISBN`). | **VERIFIED COMPLETE** |
| 4 | **Search Books by Author (Task 3 & Task 12)** | `final_project/router/general.js` (`GET /author/:author`) | Filters and returns books by author name (case-insensitive & URL-decoded) via Axios. Unknown author returns `404`. (See `submission_evidence/getbooksbyauthor`). | **VERIFIED COMPLETE** |
| 5 | **Search Books by Title (Task 4 & Task 13)** | `final_project/router/general.js` (`GET /title/:title`) | Filters and returns books by title (case-insensitive & URL-decoded) via Axios. Unknown title returns `404`. (See `submission_evidence/getbooksbytitle`). | **VERIFIED COMPLETE** |
| 6 | **Retrieve Book Reviews (Task 5)** | `final_project/router/general.js` (`GET /review/:isbn`) | Retrieves reviews object for specified ISBN. Returns empty object `{}` when no reviews exist. (See `submission_evidence/getbookreview`). | **VERIFIED COMPLETE** |
| 7 | **User Registration (Task 6)** | `final_project/router/general.js` (`POST /register`) | Validates input format; rejects missing credentials (`400`) and duplicate usernames (`409`). Registers new valid users. (See `submission_evidence/register`). | **VERIFIED COMPLETE** |
| 8 | **User Login & JWT Authentication (Task 7)** | `final_project/router/auth_users.js` (`POST /customer/login`) | Validates credentials against registered users, issues JWT signed with secret `'access'`, and sets session authorization. (See `submission_evidence/login`). | **VERIFIED COMPLETE** |
| 9 | **Add / Modify Book Review (Task 8)** | `final_project/router/auth_users.js` (`PUT /customer/auth/review/:isbn`) | Protected route under session/JWT middleware. Adds review under authenticated username, updates review if submitted again by same user, retains reviews from different users. (See `submission_evidence/reviewadded`). | **VERIFIED COMPLETE** |
| 10 | **Delete Book Review (Task 9)** | `final_project/router/auth_users.js` (`DELETE /customer/auth/review/:isbn`) | Only deletes review created by the authenticated user for the given ISBN. Other users' reviews remain untouched. Missing review returns `404`. (See `submission_evidence/deletereview`). | **VERIFIED COMPLETE** |
| 11 | **Async Axios Code (Tasks 10–13)** | `final_project/router/general.js` (`getBookList`, `getBookByISBN`, `getBookByAuthor`, `getBookByTitle`) | Genuine Axios HTTP requests querying dedicated local data service (`port 5001`) without recursion, loopback deadlocks, or fabricated external APIs. Fallback handling ensures resilience. | **VERIFIED COMPLETE** |
| 12 | **All Ten Evidence Files Generated** | `submission_evidence/` | 10 evidence files generated with exact required names, verified real cURL commands, and full terminal/HTTP responses. | **VERIFIED COMPLETE** |
| 13 | **Automated Test Suite Verified** | `final_project/test_suite.js` | 22 comprehensive test scenarios covering all normal and edge case operations executed and verified (22 Passed, 0 Failed). | **VERIFIED COMPLETE** |
| 14 | **GitHub Changes Committed & Pushed** | Git repository (`main` branch) | Clean git history, exclusion of `node_modules` and secrets, pushed to `dishant1313/expressBookReviews`. | **VERIFIED COMPLETE** |
| 15 | **Public Repository URL Verified** | `https://github.com/dishant1313/expressBookReviews` | Verified public access on GitHub. | **VERIFIED COMPLETE** |
| 16 | **Public general.js File URL Verified** | `https://github.com/dishant1313/expressBookReviews/blob/main/final_project/router/general.js` | Verified direct file URL for evaluator inspection. | **VERIFIED COMPLETE** |

---

### Evidence File Inventory

1. **Deliverable 1: `submission_evidence/githubrepo`**
   - Command: `curl.exe -s https://api.github.com/repos/dishant1313/expressBookReviews`
   - Content: Verification of fork parent `ibm-developer-skills-network/expressBookReviews` and public repository metadata.
2. **Deliverable 2: `submission_evidence/getallbooks`**
   - Command: `curl.exe -i http://localhost:5000/`
   - Content: HTTP 200 response with all 10 books in JSON format.
3. **Deliverable 3: `submission_evidence/getbooksbyISBN`**
   - Command: `curl.exe -i http://localhost:5000/isbn/1`
   - Content: HTTP 200 response returning book details for ISBN 1 ("Things Fall Apart").
4. **Deliverable 4: `submission_evidence/getbooksbyauthor`**
   - Command: `curl.exe -i "http://localhost:5000/author/Jane%20Austen"`
   - Content: HTTP 200 response returning books written by Jane Austen.
5. **Deliverable 5: `submission_evidence/getbooksbytitle`**
   - Command: `curl.exe -i "http://localhost:5000/title/Pride%20and%20Prejudice"`
   - Content: HTTP 200 response returning book matching "Pride and Prejudice".
6. **Deliverable 6: `submission_evidence/getbookreview`**
   - Command: `curl.exe -i http://localhost:5000/review/1`
   - Content: HTTP 200 response returning initial book reviews (`{}`).
7. **Deliverable 7: `submission_evidence/register`**
   - Command: `curl.exe -i -X POST http://localhost:5000/register -H "Content-Type: application/json" -d "..."`
   - Content: HTTP 200 response confirming user registration (`User successfully registered. Now you can login`).
8. **Deliverable 8: `submission_evidence/login`**
   - Command: `curl.exe -i -c cookie.txt -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d "..."`
   - Content: HTTP 200 response with JWT access token and session cookie header (`connect.sid`). Passwords and reusable tokens redacted.
9. **Deliverable 9: `submission_evidence/reviewadded`**
   - Command: `curl.exe -i -b cookie.txt -X PUT "http://localhost:5000/customer/auth/review/1?review=..."`
   - Content: HTTP 200 response confirming review added/updated, plus follow-up GET request proving review persistence in database.
10. **Deliverable 10: `submission_evidence/deletereview`**
    - Command: `curl.exe -i -b cookie.txt -X DELETE http://localhost:5000/customer/auth/review/1`
    - Content: HTTP 200 response confirming review deletion, plus follow-up GET request verifying review was removed.

---

### Architecture & Asynchronous Design Notes
1. **Local Data Service Architecture:**
   - To strictly comply with Phase 4 without recursive HTTP requests to the same Express route and without fabricating external third-party endpoints, an in-process local HTTP service (`final_project/router/data_service.js`) was implemented on port `5001`.
   - The service serves the genuine `booksdb.js` dataset over HTTP.
   - `general.js` uses `axios.get()` with `async/await` to consume this service.
   - If port 5001 is unavailable, a direct fallback mechanism preserves functionality without failing.
2. **Security & Session Authentication:**
   - The authentication middleware in `final_project/index.js` validates JWT tokens via either Express session (`req.session.authorization['accessToken']`) or HTTP `Authorization` headers (`Bearer <token>`).
   - Passwords and session secrets are never exposed in responses or Git commits.
