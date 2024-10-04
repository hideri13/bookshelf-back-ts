import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import bookRoutes from "./book/book.routes";

dotenv.config();

const app = express();
const port = process.env.PORT ? process.env.PORT : 6000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/', bookRoutes)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}. Press CTRL+C to stop`);
})