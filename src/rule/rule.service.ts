import { db } from "../utils/db.server";

type Rule = {
    id: string;
    preFactId_1: string;
    preExp: string | null;
    preFactId_2: string | null;
    postFactId_1: string;
    postExp: string | null;
    postFactId_2: string | null;
}

// List Facts
// List a Fact
// Update a Fact
// Delete a Fact

// export const listRule = async (): Promise<>