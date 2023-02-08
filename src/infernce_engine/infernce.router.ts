import express from "express"
import type { Request, Response } from "express"
import { body, validationResult } from "express-validator"

import * as InfernceEngineService from "./infernce.service"

export const infernceEngineRouter = express.Router();


// GET List KB
infernceEngineRouter.get("/", async (req: Request, res: Response) => {
    try {
        const allKB = await InfernceEngineService.listKB();
        return res.status(200).json(allKB);
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
})

// GET RootNode
infernceEngineRouter.get("/root", async (req: Request, res: Response) => {
    try {
        const result = await InfernceEngineService.start();
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
})

