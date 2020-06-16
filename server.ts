import express from "express";
import path from "path";
import cors from "cors";
import { Router as OfferupRouter } from "./routes/offerup";
const app = express();

app.use(express.json());
app.use(cors());

app.use("/offerup", OfferupRouter);

app.use(express.static(path.join(__dirname, "../public")));
app.listen(3000, () => console.log("listening on 3000"));
