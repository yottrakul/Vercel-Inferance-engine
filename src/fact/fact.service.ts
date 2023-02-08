import { db } from "../utils/db.server";

type Fact = {
    id: string;
    label: string;
    fact: string | null;
  };


export const listFacts = async (): Promise<Fact[]> => {
    return db.fact.findMany({
        select: {
            id: true,
            label: true,
            fact: true,
        }
    });
};

export const getFacts = async (id: string): Promise<Fact | null> => {
    return db.fact.findUnique({
        where: {
            id,
        }
    });
};

export const createFact = async (factInput: Omit<Fact, "id">): Promise<Fact> => {
    const { label, fact } = factInput;
    return db.fact.create({
        data: {
            label,
            fact,
        },
        select: {
            id: true,
            label: true,
            fact: true,
        }
    });
};

export const updateFact = async(factInput: Omit<Fact, "id">, id: string): Promise<Fact> => {
    const { fact, label } = factInput;
    return db.fact.update({
        where: {
            id,
        },
        data: {
            fact,
            label
        },
        select: {
            id: true,
            label: true,
            fact: true,
        }
    });
};

export const deleteFact = async(id: string): Promise<void> => {
    await db.fact.delete({
        where: {
            id
        },
    });
};