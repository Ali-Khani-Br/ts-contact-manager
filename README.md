# TS Contact Manager

A minimal **TypeScript** CLI app to manage contacts (CRUD) using Node.js `fs/promises` + JSON.
Useful for learning TypeScript, async/await, and simple CLI patterns.

## Run (dev)
```bash
npm run dev -- add --name "Ali" --email "ali@mail.com" --phone "123"
npm run dev -- list
npm run dev -- update --email "ali@mail.com" --phone "999" --name "Ali Reza" --newemail "ali2@mail.com"
npm run dev -- remove --email "ali@mail.com"