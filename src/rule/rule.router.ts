import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as RuleService from "./rule.service";

export const ruleRouter = express.Router();

// GET: List of Rules

ruleRouter.get("/", async (req: Request, res: Response) => {
  try {
    const rules = await RuleService.listRules();
    return res.status(200).json(rules);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET: Single a Rule

ruleRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const rule = await RuleService.getRule(id);
    if (rule) {
      return res.status(200).json(rule);
    }
    return res.status(404).json({ error: "rule not found." });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST: Create a rule
// Params : preFactId_1, preFactId_2, preExp, postFactId_1, postFactId_2, postExp,

ruleRouter.post(
  "/",
  body("preFactId_1").isString(),
  body("preFactId_2").isString().optional({ nullable: true }),
  body("preExp").isString().optional({ nullable: true }),
  body("postFactId_1"),
  body("postFactId_2").optional({ nullable: true }),
  body("postExp").optional({ nullable: true }),
  async (req: Request, res: Response) => {
    // Validation Params
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    try {
      const rule = req.body;
      const createdRule = await RuleService.createRule(rule);
      return res.status(200).json(createdRule);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// PUT: Update a rule
ruleRouter.put(
    "/:id",
    body("preFactId_1").isString().optional({nullable: true}),
    body("preFactId_2").isString().optional({ nullable: true }),
    body("preExp").isString().optional({ nullable: true }),
    body("postFactId_1").optional({nullable: true}),
    body("postFactId_2").optional({ nullable: true }),
    body("postExp").optional({ nullable: true }),
    async (req: Request, res: Response) => {
      // Validation Params
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
          return res.status(400).json(errors.array());
      }

      const id = req.params.id;
  
      try {
        const rule = req.body;
        const putRule = await RuleService.updateRule(rule, id);
        return res.status(200).json(putRule);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }
  );

// DELETE: Delete a rule
ruleRouter.delete("/:id", async (req: Request, res: Response) => {
    const id: string = req.params.id;
    try {
        await RuleService.deleteRule(id);
        return res.status(200).json({status: "200", msg: `Fact '${id}' is deleted`})
    } catch (error: any) {
        return res.status(500).json({error: error.message});
    }
})
