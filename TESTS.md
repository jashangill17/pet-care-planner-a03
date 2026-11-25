# Automated testing for Assignment 2

**IMPORTANT NOTE**
Just because the tests fail does not *necessarily* mean you won't do well on this assignment. The same thing goes if the tests pass. It does not *necessarily* mean you'll get 100%. Your instructor will interpret the test results along with your actual solution codebase.

## Pre Requisites
node.js and npm.

## Testing and Feedback
- Run the provided component test suite:
```sh
# initialize playwright (only required once, you can skip this for subsequent tests)
npx playwright install chromium
# run the component tests
npm test
```

- If you would also like to run the e2e test suite, first build the project in the root directory:
```sh
# build the application
npm run build
# run the e2e tests
npm run test:e2e
```

**NOTE:** If you make updates to you components, you will need to build the app before running the e2e tests.
