import { db } from "../utils/db.server";
var tnthai = require("tnthai");

// tnthai Object
const twc = new tnthai();

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

export const findFacts = async(msg: string): Promise<Fact[]|undefined> => {
    const {solution: words}:{solution: Array<string>} = twc.segmenting(msg);
    // console.log(words);
    if(words.length === 0){
        return [];
    }

    const facts = await listFacts();
    const factsResult: Array<Fact> = facts.filter(fact => {
        //เช็คว่า Fact มี detail(fact) มั้ย?
        if(!fact.fact) {
            return words.some(word => {
                return word.toLowerCase() === fact.label;
            })
        } else if (fact.label && fact.fact) {
            return words.some(word => {
                return word.toLowerCase() === fact.fact
            })
        }
    })

    return factsResult;
}
