# JobGet Senior Backend Developer Test

Hello and thanks for taking the time to try this out.

The goal of this test is to assert (to some degree) your coding and architectural skills. You're given a simple problem so you can focus on showcasing development techniques. We encourage you to overengineer the solution a little to show off what you can do - assume you're building a production-ready application that other developers will need to work on and add to over time.

We accept tests written in Node.js or Python - your choice of language should be one you can demonstrate being comfortable coding in, to maximise your chance of a positive code review. You can use any database that you are comfortable on , however please mention it in the documentation.

You're **allowed and encouraged** to use third party libraries, as long as you put them together yourself **without relying on a framework or microframework** to do it for you. An effective developer knows what to build and what to reuse, but also how his/her tools work. Be prepared to answer some questions about those libraries, like why you chose them and what other alternatives you're familiar with.

As this is a code review process, please avoid adding generated code to the project. This makes our jobs as reviewers more difficult, as we can't review code you didn't write. This means avoiding any libraries which generates thousands of lines of code in stub files.


## Requirements

We'd like you to build a simple Recipes API. The API **MUST** conform to REST practices and **MUST** provide the following functionality:

- List, create, read, update, and delete Recipes
- Search recipes
- Rate recipes

## Submitting

Once you are done with your test please go ahead push to github and add us to the repo.

Addtionally, while we love open source please **DO NOT** create a public repository for this test or any of it's contents.

### Endpoints

Your application **MUST** conform to the following endpoint structure and return the HTTP status codes appropriate to each operation. Endpoints specified as protected below **SHOULD** require authentication to view. The method of authentication is up to you.

##### Recipes

| Name   | Method      | URL                    | Protected |
| ---    | ---         | ---                    | ---       |
| List   | `GET`       | `/recipes`             | ✘         |
| Create | `POST`      | `/recipes`             | ✓         |
| Get    | `GET`       | `/recipes/{id}`        | ✘         |
| Update | `PUT/PATCH` | `/recipes/{id}`        | ✓         |
| Delete | `DELETE`    | `/recipes/{id}`        | ✓         |
| Rate   | `POST`      | `/recipes/{id}/rating` | ✘         |

An endpoint for recipe search functionality **MUST** also be implemented. The HTTP method and endpoint for this **MUST** be clearly documented.

### Schema

- **Recipe**
    - Unique ID
    - Name
    - Prep time
    - Difficulty (1-3)
    - Vegetarian (boolean)

Additionally, recipes can be rated many times from 1-5 and a rating is never overwritten.

## Evaluation criteria

These are some aspects we pay particular attention to:

- You **MUST** use packages, but you **MUST NOT** use a web-app framework or microframework. 
- The API **MUST** return valid JSON and **MUST** follow the endpoints set out above.
- You **MUST** write testable code and demonstrate unit testing it 
- You **SHOULD** pay attention to best security practices.
- You **SHOULD** follow SOLID principles where appropriate.
- You do **NOT** have to build a UI for this API.

The following earn you bonus points:

- Your answers during code review
- An informative, detailed description in the PR
- Setup with a one liner or a script
- Content negotiation
- Pagination
- Using any kind of Database Access Abstraction
- Other types of testing - e.g. integration tests
- Following the industry standard style guide for the language you choose to use 
- A git history (even if brief) with clear, concise commit messages.

---

Good luck!