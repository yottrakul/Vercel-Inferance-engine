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

    const arrayMsg = msg.split(" ");
    const resultCut = arrayMsg.map((msg) => {
        const {solution}:{solution: Array<string>} = twc.segmenting(msg);
        return solution
    })

    // const {solution: words}:{solution: Array<string>} = twc.segmenting(msg);
    // console.log(words);

    
    if(resultCut.length === 0){
        return [];
    }

    

    const facts = await listFacts();
    const factsResult: Array<Fact> = facts.filter(fact => {
        //เช็คว่า Fact มี detail(fact) มั้ย?
        // if(!fact.fact) {
        //     return words.some(word => {
        //         return word.toLowerCase() === fact.label;
        //     })
        // } else if (fact.label && fact.fact) {
        //     return words.some(word => {
        //         return word.toLowerCase() === fact.fact
        //     })
        // }

        // เช็ค Node ก่อน
        const matchNode = arrayMsg.some((msg) => {
            fact.label === msg;
        })
        const cutMatchNode = resultCut.some(word => {
            return word.some(i => {
                return i === fact.label;
            })
        })
        if(matchNode || cutMatchNode) {
            return true;
        }
        // เช็ค Description
        // เช็คทั้งคำ Description
        // ใช้เทคนิคแยกคำใน fact.fact ด้วยจะได้มี % ในการหาเจอมากขึ้น
        // ก่อนเช็คดูด้วยมี fact.fact มั้ย
        if(fact.fact !== null) {
            // msg = ["หายใจลำบาก"]
            // fact.fact = "หายใจลำบาก"
            const {solution: factWordCut}:{solution: Array<string>} = twc.segmenting(fact.fact);
            // factWordCut = ["หายใจ","ลำบาก"]
            const matchFact = resultCut.some(word => {
                return word.some(i => {
                    // i = "หายใจ"
                    return factWordCut.some(w => {
                        return w === i;
                    }) 
                })
            })
            if(matchFact) {
                return true;
            }

        }

        return false;

    })

    return factsResult;
}
