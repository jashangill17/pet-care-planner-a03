# Assignment 03: Pet Care Planner

**Weight:** 20%
**Submission:** Via GitHub Classroom (starter files provided)

[Clone](#cloning-instructions) this repo to your computer and then follow the specifications below to complete this assignment. When you are done, [submit](#submission-instructions) your solution.

---

## Cloning Instructions

Follow these instructions to clone this repository to your computer.

1. Open **Visual Studio Code**.
2. Open the command palette and type `clone`. Select the `Git: Clone` option.
   *Press either <kbd>F1</kbd> **or** <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> to open the command palette.*
3. Click **Clone from GitHub** and follow the prompts.
4. When prompted, open the repository in the current window.

## Submission Instructions

> **NOTE:** Unless your instructor explicitly provides alternate submission instructions, you must follow the process outlined here.

**All** your work for this assignment should be done on a ***local copy* of the assignment** on ***your* computer**.

To submit your work, follow the *git commit* and *push* process demonstrated by your instructor.

> **Do not upload** your submission using GitHub's web upload. Your instructor may assign a mark of zero (0%) if you upload files instead of using the proper commit and push workflow.

## Repo Layout

- `app/`: the application you will build
- `backend/`: the required backend API for this assignment (no public API is used)

Backend API details are documented in the [backend/README](backend/README.md).

## Setup and Run

Run the backend:
```sh
cd backend
npm install
npm start
```

Run the app:
```sh
cd app
npm install
npm run dev
```

## Do the Work
Follow and implement the specifications in [SPECS.md](SPECS.md).

## Evaluation Criteria (20 Marks Total)

**NOTE: You must demonstrate incremental development of your solution. This means that you must begin work on your solution as soon as possible and commit often to the assignment repository. Each commit must demonstrate functional improvements to the solution. Failure to show incremental work during the assignment period will result in loss of marks of up to 20%.**
 
**Additionally, you are encouraged to use external resources to help you learn what is needed for the assignment. However, if you submit code that differs greatly from what was demonstrated in class it must be documented (e.g. comments, citations, etc.) and you may be asked to provide a verbal explanation of how the code works to your instructor. Failure to explain any code you submitted will be considered as potential evidence of academic misconduct and may trigger an investigation, potentially resulting in further consequences.**

| Category                       | Marks | Description                                                        |
|--------------------------------|:----:|---------------------------------------------------------------------|
| Functional Completeness        |  4   | Plans list + plan detail render correctly and routing works end to end |
| React Router                   |  5   | Correct static/dynamic routes, navigation, and nested routing usage  |
| Async Data Flow + Custom Hook  |  5   | `usePlans` fetches list/detail correctly with good loading/error UX  |
| UI, Accessibility, Styling     |  2   | Polished, accessible UI with Tailwind and DaisyUI                   |
| Reflection                     |  4   | Clear, thoughtful answers in README                                 |

> **NOTE:** see attached rubric on Brightspace for more details on criterion scoring.

## Testing and Feedback
Follow directions in [TESTS.md](TESTS.md).

## Reflection Prompt (for README)
Add a section to your README that answers:

- Pick one specific commit where routing first worked end-to-end (include commit hash and timestamp). Explain what was still broken in that commit, how you verified it was broken, and exactly what changed in the next commit to fix it.
- For one concrete URL in your app (either /plans or /plans/:id), reconstruct the render path from main.jsx to the final component that shows content. Name the exact files/components involved and identify one place where you initially put logic in the wrong component.
- Describe one failure case you personally triggered in the Plans workflow (for example: invalid plan id route, backend stopped, malformed response). Document the exact UI state shown to the user, and explain one change you would make to improve that failure experience without adding new libraries.

## Reflection

### 1. The first commit where routing was end to end.

Commit 2c4f5d0 (2026-11-25 09:45) was the first one where routing worked end to end. You might go between / and /pets, between Pets and Plans via the nav links, and the plans list was loaded on the backend. Nevertheless, a broken click on a plan. All plans linked to /plans/plan-1 and main.jsx did not have a route of /plans/:id. I clicked on Daily Routine: the entire page was blanked out, including the nav bar and the browser console displayed the error `No routes matched location "/plans/plan-1"`. This was followed by e48eb21 where I added a nested route `<Route path=":id" element={<PlanDetail />} />` within the plans route and developed PlanDetail.jsx. This is now displayed in the inside of the `<Outlet />` in PlansPage.

### 2. Render path of /plans/plan-1

main.jsx to BrowserRouter to Routes to the / route to App.jsx to Dashboard.jsx (nav links and `<Outlet />`) to the plans route to pages/PlansPage.jsx to PlansPage with PlanList.jsx on the side and an `<Outlet />` to the :id route to PlanDetail.jsx. PlanDetail takes id with useParams, fetchPlanById(id) in hooks/usePlans.js, which calls fetchPlan in api/pet-care-api.js (GET /plans/plan-1). One of the first components I initially misplaced logic: the fetching (useEffect, loading and error state) went directly into PlanList and PlanDetail in Milestones B and C. In commit 8973e31, I moved it into the usePlans() hook to enable the components to only show data. Another example: in the starter the state of selected-pet resided in Dashboard. I migrated it to PetsPage, as Dashboard has been turned into the layout.

### 3. One of my failures.

I went to /plans/plan-999, which is a non-existent plan id. The backend returned 404. The plan list remained on the left, however, the detail area displayed a red role="alert" box with a Failed to find plan with a Try again button. This is no fun, since it will never work with a plan that is not there, when you say Try again. Without adding any library, I would check for the 404 status in fetchPlan and show a friendlier message like "This plan doesn't exist", with a link back to /plans instead of the retry button.

Another real problem: initially, the tests did not work, and a useNavigate error occurred. The tests were imported with react-router-dom but I was using react-router and thus there were two instances of the router. It was fixed by switching the imports to react-router-dom, in commit 9cc785d.
