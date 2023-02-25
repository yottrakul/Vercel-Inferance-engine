import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { factRouter } from "./fact/fact.router";
import { ruleRouter } from "./rule/rule.router";
import { infernceEngineRouter } from "./infernce_engine/infernce.router"

dotenv.config();

// if(!process.env.PORT) {
//     process.exit(1);
// }

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/facts", factRouter);
app.use("/api/rules", ruleRouter);
app.use("/api/infer_engine", infernceEngineRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})