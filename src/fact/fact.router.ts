import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as FactService from "./fact.service";

export const factRouter = express.Router();

// GET: List of all Facts
factRouter.get("/", async (req: Request, res: Response) => {
  // console.log("This OK");
  try {
    const facts = await FactService.listFacts();
    return res.status(200).json(facts);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

//GET: A single fact by ID
factRouter.get("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    const fact = await FactService.getFacts(id);
    if (fact) {
      return res.status(200).json(fact);
    }
    return res.status(404).json({ error: "Fact could not be found" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: Search Fact from message
factRouter.get("/search/:msg", async (req: Request, res: Response) => {
  const msg: string = req.params.msg;
  try {
    const facts = await FactService.findFacts(msg);
    if (facts?.length !== 0) {
      return res.status(200).json(facts);
    }
    return res.status(404).json({error: "No Fact Match"});
  } catch (error: any) {
    return res.status(500).json({error: error.message});
  }
})

// POST: Create a Fact
// Params: label,fact

factRouter.post(
  "/",
  body("label").isString(),
  body("fact").isString().optional({nullable: true}),
  async (req: Request, res: Response) => {
    // ดัก Error validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Error");
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const fact = req.body;
      const newFact = await FactService.createFact(fact);
      return res.status(201).json(newFact);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// PUT: Update label,fact
// Params: label,fact (label = ชื่อเล่น Fact, fact = รายละเอียดของ fact)

factRouter.put(
  "/:id",
  body("label").isString(),
  body("fact").isString(),
  async (req: Request, res: Response) => {
    // ดัก Error validation
    const errors = validationResult(req);
    const id: string = req.params.id;
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    try {
      const fact = req.body;
      const updateFact = await FactService.updateFact(fact, id);
      return res.status(200).json(updateFact);
    } catch (error: any) {
      return res.status(500).json({error: error.message})
    }
  }
);

factRouter.delete("/:id", async(req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await FactService.deleteFact(id);
    return res.status(200).json({status: "200", msg: `Fact '${id}' is deleted`})
  } catch (error: any) {
    return res.status(500).json({error: error.message});
  }
})
