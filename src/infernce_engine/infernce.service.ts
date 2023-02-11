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
  kb: Array<Rule>;
  bb: Array<Fact>;
  save_query: Array<Fact>;
  query: Array<Fact>;
  result: Array<Fact> | null;
  startNode: Array<Fact>;
  concludNode: Array<Fact>;
};

// List KB
export const listKB = async (): Promise<Rule[]> => {
  return loadKB();
};

// StartEngine
export const start = async (state: State): Promise<State> => {
  // ถ้ายังไม่มี KB ใน State
  // ทำการสร้าง State ใหม่
  if (state.kb === undefined) {
    state = await initializationState(state);
    return state;
  }

  // Rule remain?
  let RuleRemain: number = state.kb.length;

  ruleRemain: while (RuleRemain > 0) {
    let kb_counter: number = 0;
    startingNodeCheck: do {
      // PremiseMathcBB Loop
      PremiseMatchBB: do {
        // Get first rule
        const firstRule: Rule = state.kb[kb_counter];

        // Get first premise of the rule
        const firstPremise: Fact = firstRule.preFact_1;

        // Premise match BB?
        let PremiseMatchBB: boolean = state.bb.some((fact) => {
          return fact.id === firstPremise.id;
        });
        // OR Condition: CheckPremiseMatchBB again
        const preExpIsOR = firstRule.preExp === "OR";
        if (preExpIsOR && !PremiseMatchBB) {
          const MatchBB = state.bb.some((fact) => {
            return fact.id === firstRule.preFact_2?.id;
          });
          if (MatchBB) {
            PremiseMatchBB = true;
          }
        }

        // ถ้าไม่มี Premise ใน firstRule ที่ Match กับ BB เลย
        if (!PremiseMatchBB) {
          // เพิ่ม KB_COUNTER และหา Rule ถัดไป
        //   kb_counter++;
          break PremiseMatchBB;
        }

        // Premise remain?
        const PremiseRemain = firstRule.preFact_2 !== null;
        if (PremiseRemain) {
          // Get next Premise
          const nextPremise = firstRule.preFact_2;
          // Check Again (Premise match BB?)
          // ถ้าไม่ MatchBB
          if (
            !state.bb.some((fact) => {
              return fact.id === nextPremise?.id;
            })
          ) {
            // ออกจาก PremiseMatchBB Loop
            // กรณีเป็น "OR" ไม่ต้อง break
            if (!preExpIsOR) {
            // เพิ่ม KB_COUNTER และหา Rule ถัดไป
              kb_counter++;
              continue;
            }
          }
        }

        // If not have premise remain (FALSE)
        // Firing the rule, Add conclusion to BB (update BB)
        state.bb.push(firstRule.postFact_1);

        // AND Condition, Add another conclusion
        if (firstRule.postFact_2 !== null) {
          state.bb.push(firstRule.postFact_2);
        }

        //Skip the fired rule (update KB)
        state.kb = state.kb.filter((rule) => {
          return rule.id !== firstRule.id;
        });
        RuleRemain--;

        // Reset kb_counter
        kb_counter = 0;
      } while (RuleRemain > 0);
      // End PremiseMathcBB Loop

      // Premise is Starting Node?
      // Get first rule
      if(RuleRemain ===0) {
        break ruleRemain;
      }
      const firstRule: Rule = state.kb[kb_counter];

      // Get first premise of the rule
      const firstPremise: Fact = firstRule.preFact_1;
      // Get second premise of the rule
      const secondPremise: Fact | null = firstRule.preFact_2;

      // Find first premise in Starting Node pool
      const isInStartNode: boolean = state.startNode.some((fact) => {
        return fact.id === firstPremise.id;
      });
      // Find second premise in Starting Node pool
      let second_isInStartNode: boolean = false;
      if (secondPremise !== null) {
        if (
          state.startNode.some((fact) => {
            return fact.id === secondPremise.id;
          })
        ) {
          second_isInStartNode = true;
        }
      }

      // Premise is Starting Node?
      if (isInStartNode || second_isInStartNode) {
        // Check Query false is save?
        const false_queryAlreadySave = state.save_query.some((fact) => {
          const result =
            firstPremise.id === fact.id || secondPremise?.id === fact.id;
          return result;
        });
        // Query the user
        if (!false_queryAlreadySave) {
          // Clear Query
          state.query = [];
          if (isInStartNode) {
            state.query.push(firstPremise);
          }
          if (second_isInStartNode && secondPremise !== null) {
            state.query.push(secondPremise);
          }
          return state;
        } else {
          // Clear Query
          state.query = [];
        }
      }

      // Rule remain?
      if (state.kb[kb_counter + 1] !== undefined) {
        // Get next rule
        kb_counter++;
        continue startingNodeCheck;
      } else {
        break ruleRemain;
      }
    } while (true);
  }

  // Have Concluding nodes in BB?
  const BBHaveConcludNode = state.bb.filter((fact) => {
    return state.concludNode.some((item) => {
      return item.id === fact.id;
    });
  });
  if (BBHaveConcludNode.length > 0) {
    // Answer is concluding nodes
    state.result = BBHaveConcludNode;
    state.query = [];
    return state;
  } else {
    // No Answer
    state.result = null;
  }

  return state;
};

// Load KB
async function loadKB(): Promise<Rule[]> {
  return db.rule.findMany({
    include: {
      postFact_1: true,
      postFact_2: true,
      preFact_1: true,
      preFact_2: true,
    },
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
  state.query = [];
  state.result = [];
  state.save_query = [];

  return state;
}

// getStartingNodes
function getStartingNodes(kb: Array<Rule>): Array<Fact> {
  const { array_leftFact, array_rightFact } = separateFact(kb);
  const start_nodes: Array<Fact> = array_leftFact.filter((fact) => {
    return !array_rightFact.some((factRight) => {
      return factRight.id === fact.id;
    });
  });

  return start_nodes;
}

// getConcludingNodes
function getConcludingNodes(kb: Array<Rule>): Array<Fact> {
  const { array_leftFact, array_rightFact } = separateFact(kb);
  const concluding_nodes: Array<Fact> = array_rightFact.filter((fact) => {
    return !array_leftFact.some((factLeft) => {
      return factLeft.id === fact.id;
    });
  });

  return concluding_nodes;
}

// separate Fact to Left and Right
function separateFact(kb: Array<Rule>) {
  // แบ่ง Fact ออกเป็นฝั่งซ้ายและขวาเพื่อหา root,terminal Node
  //leftFacts Set และใช้ array_leftFact
  let leftFact: Set<Fact> = new Set(
    kb.flatMap((fact) => {
      if (fact.preFact_2 === null) {
        return fact.preFact_1;
      }
      return [fact.preFact_1, fact.preFact_2];
    })
  );
  let array_leftFact: Array<Fact> = Array.from(leftFact);

  //rightFacts Set และใช้ array_rightFact
  let rightFact: Set<Fact> = new Set(
    kb.flatMap((fact) => {
      if (fact.postFact_2 === null) {
        return fact.postFact_1;
      }
      return [fact.postFact_1, fact.postFact_2];
    })
  );
  let array_rightFact: Array<Fact> = Array.from(rightFact);

  return { array_leftFact, array_rightFact };
}
