import express from "express"
import { connectToDatabase } from "./database/connectionToDatabase.js"
import dotenv from "dotenv";
import authRoutes from './routes/auth-route.js'
dotenv.config();

const app = express()
app.use(express.json());
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectToDatabase();

app.use('/api/auth', authRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})