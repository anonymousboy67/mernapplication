import express from "express"
import { connectToDatabase } from "./database/connectionToDatabase.js"
import dotenv from "dotenv";
dotenv.config();

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectToDatabase();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})