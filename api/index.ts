import * as express from "express";
import * as OfferupRouter from "./offerup";
import * as path from "path";
import * as cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/offerup", OfferupRouter.default);
app.use(express.static(path.join(__dirname, "../public")));

app.listen(3000, () => console.log("listening on 3000"));
