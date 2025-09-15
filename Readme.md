# Move37 Ventures Backend Developer Challenge: Real-Time Polling
## Introduction
This project was created for the Move37 Ventures Backend Developer Challenge, for their internship assignment.
## Running Intruction
To run the project as minimally as possible the following steps must be followed:
### Step 1
Make a `.env` file with the following content
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database?schema=public" #database url
PORT=3000 # the port the server will run in
SECRET="dl;sjfpioewhrlnfgn/,.azdnvlikhzl;gnjhoiretghti[8ohalrfhjgoj" #secret for purpose of sign in
```
### Step 2
Install the dependencies
```bash
npm i
```
### Step 3
Generate the prisma client, although the generated prisma client is included in the project, it's still better to generate it before running the next parts.
```bash
npm run generate-prisma
```
### Step 4
Migrate the database
```bash
npm run migrate
```
### Step 5
After this the server can be started in development as follows:
```bash
npm run dev
```
This project doesn't include a production way to start the server since it's not meant for production use.

## Testing
After the setup for starting the server, the tests can be ran as well to see that all requirement has been fulfilled. To test the following must be run.
```bash
npm run test
```

## Notes
For this project, the requirement, only required crud operations, however, looking at the usecase, a primitive login/session system has been added to the project, additionally a data validator was added. The project specified only prisma, nodejs, expressjs and socket.io maybe used, as such no other library were installed unless absolutely neccesarry. Typing is done through jsdoc, since typescript wasn't specified in the doc. Additionally data validation was implemented specific for this project, rather than using the commonly used zod. Session was also implemented using only node standard library. The only libraries that were installed even though they were not specified in the document are as follows: `cookie-parser`, `dotenv`, `dotenv`, `@types/cookie-parser`, `@types/dotenv`, `@types/express`.

`cookie-parser` was installed for purposes of managing sessions.
`dotenv` was installed for purposes of managing environment variables.
`@types/*` were installed for ease of development.

Testing was implemented to show that the apis work as intended. However I do not have as much experience in writting tests as I have in backend development, as such the tests maybe a little sloppily written.
