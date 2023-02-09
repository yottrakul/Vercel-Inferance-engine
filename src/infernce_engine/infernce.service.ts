import { db } from "../utils/db.server";

export type Rule = {
    id: string;
    preFactId_1: string;
    preExp: string | null;
    preFactId_2: string | null;
    postFactId_1: string;
    postExp: string | null;
    postFactId_2: string | null;
    preFact_1: Fact;
    preFact_2: Fact | null;
    postFact_1: Fact;
    postFact_2: Fact | null;
};

export type Fact = {
    id: string;
    label: string;
    fact: string | null;
};

export type State = {
    kb: Array<Rule> | null,
    bb: Array<Fact> | null,
    save_query: Array<Fact> | null,
    query: Fact | null
    result: Array<Fact> | null,
    startNode: Array<Fact> | null,
    concludNode: Array<Fact> | null
}

// List KB
export const listKB = async(): Promise<Rule[]> => {
    return loadKB();
} 

// StartEngine
export const start = async(state: State): Promise<State> => {

    // ถ้ายังไม่มี KB ใน State
    // ทำการสร้าง State ใหม่
    if(state.kb === undefined) {
        state = await initializationState(state);
    }

    // Get First Rule
    // const firstRule = kb.

    

    return state

}

// Load KB
async function loadKB(): Promise<Rule[]> {
    return db.rule.findMany({
        include: {
            postFact_1: true,
            postFact_2: true,
            preFact_1: true,
            preFact_2: true,
        }
    });
}

// Initialization state
async function initializationState(state: State): Promise<State> {
    // Initialization state
        // Load KB
        const KB = await loadKB();
        state.kb = KB;

        //Check Starting Node
        const startNodes = getStartingNodes(KB);
        state.startNode = startNodes;

        //Check Concluding Node
        const concludingNodes = getConcludingNodes(KB);
        state.concludNode = concludingNodes;

        state.bb = [];
        state.query = null;
        state.result = [];
        state.save_query = [];

        return state;
}

// getStartingNodes
function getStartingNodes(kb: Array<Rule>): Array<Fact> {
    const { array_leftFact, array_rightFact } = separateFact(kb);
    const start_nodes: Array<Fact> = array_leftFact.filter(fact => {
        return !(array_rightFact.some(factRight => {
            return factRight.id === fact.id
        }));
    });

    return start_nodes;
}

// getConcludingNodes
function getConcludingNodes(kb: Array<Rule>): Array<Fact> {
    const { array_leftFact, array_rightFact } = separateFact(kb);
    const concluding_nodes: Array<Fact> = array_rightFact.filter(fact => {
        return !(array_leftFact.some(factLeft => {
            return factLeft.id === fact.id
        }));
    });

    return concluding_nodes;
}

// separate Fact to Left and Right
function separateFact(kb: Array<Rule>) {
    // แบ่ง Fact ออกเป็นฝั่งซ้ายและขวาเพื่อหา root,terminal Node
    //leftFacts Set และใช้ array_leftFact
    let leftFact: Set<Fact> = new Set(kb.flatMap(fact => {
        if(fact.preFact_2 === null){
            return fact.preFact_1
        }
        return [ fact.preFact_1, fact.preFact_2 ]
    }));
    let array_leftFact: Array<Fact> = Array.from(leftFact);

    //rightFacts Set และใช้ array_rightFact
    let rightFact: Set<Fact> = new Set(kb.flatMap(fact => {
        if(fact.postFact_2 === null){
            return fact.postFact_1
        }
        return [ fact.postFact_1, fact.postFact_2]
    }));
    let array_rightFact: Array<Fact> = Array.from(rightFact);

    return { array_leftFact, array_rightFact }
}