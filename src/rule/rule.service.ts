import { updateFact } from "./../fact/fact.service";
import { db } from "../utils/db.server";

type Rule = {
  id: string;
  preFactId_1: string;
  preExp: string | null;
  preFactId_2: string | null;
  postFactId_1: string;
  postExp: string | null;
  postFactId_2: string | null;
};

// List Rules
// Create Rule
// Update a Rule
// Delete a Rule

export const listRules = async (): Promise<Rule[]> => {
  return db.rule.findMany();
};

export const getRule = async (id: string): Promise<Rule | null> => {
  return db.rule.findUnique({
    where: {
      id,
    },
  });
};

export const createRule = async (
  ruleInput: Omit<Rule, "id">
): Promise<Rule> => {
  const {
    preFactId_1,
    preFactId_2,
    preExp,
    postFactId_1,
    postFactId_2,
    postExp,
  } = ruleInput;

  // pre,postExp รับแค่ค่า "AND", "OR", null
  const preExpInvalid = (preExp !== "AND") && (preExp !== "OR") && (preExp !== null);
  const postExpInvalid = (postExp !== "AND") && (postExp !== "OR") && (postExp !== null);

  if(preExpInvalid || postExpInvalid) {
    throw Error("Invalid: please use 'AND', 'OR', null in preExp, postExp ")
  }

  // เมื่อ preExp ไม่เป็น null
  if(preExp !== null) {
    if(preFactId_2 === null) {
        throw Error("Invalid: please add preFactId_2")
    }
  }

  // เมื่อ preExp เป็น null
  if(preExp === null) {
    if(preFactId_2 !== null) {
        throw Error("Invalid: please remove preFactId_2")
    }
  }

  // เมื่อ postExp ไม่เป็น null
  if(postExp !== null) {
    if(postFactId_2 === null) {
        throw Error("Invalid: please add postFactId_2")
    }
  }

  // เมื่อ postExp เป็น null
  if(postExp === null) {
    if(postFactId_2 !== null) {
        throw Error("Invalid: please remove postFactId_2")
    }
  }

  // เมื่อ pre, post fact เป็น null
  if(preFactId_1 === null || postFactId_2 === null) {
    throw Error("Invalid: First Fact can't be null")
  }

  return db.rule.create({
    data: {
      preFactId_1,
      preFactId_2,
      preExp,
      postFactId_1,
      postFactId_2,
      postExp,
    },
  });
};

export const updateRule = async (
  ruleInput: Omit<Rule, "id">,
  id: string
): Promise<Rule> => {
  const {
    postExp,
    postFactId_1,
    postFactId_2,
    preExp,
    preFactId_1,
    preFactId_2,
  } = ruleInput;

  // Get Rule from database
  const rule = await db.rule.findUnique({
    where: {
        id
    }
  })

  // pre,postExp รับแค่ค่า "AND", "OR", null
  const preExpInvalid = (preExp !== "AND") && (preExp !== "OR") && (preExp !== null);
  const postExpInvalid = (postExp !== "AND") && (postExp !== "OR") && (postExp !== null);

  if(preExpInvalid || postExpInvalid) {
    throw Error("Invalid: please use 'AND', 'OR', null in preExp, postExp ")
  }

  // เมื่อ preExp มีการเปลี่ยนค่า
  if(preExp !== rule?.preExp) {
    if((rule?.preFactId_2 !== null) && (preExp === null)) {
        throw Error("Invalid: please remove postFactId_2")
    }
    if((rule?.preFactId_2 === null) && (preExp !== null)) {
        throw Error("Invalid: please add postFactId_2")
    } 
  }

  // เมื่อ postExp มีการเปลี่ยนค่า
  if(postExp !== rule?.postExp) {
    if((rule?.postFactId_2 !== null) && (postExp === null)) {
        throw Error("Invalid: please remove postFactId_2")
    }
    if((rule?.postFactId_2 === null) && (postExp !== null)) {
        throw Error("Invalid: please add postFactId_2")
    } 
  }

  // เมื่อ pre, post fact เป็น null
  if(preFactId_1 === null || postFactId_2 === null) {
    throw Error("Invalid: First Fact can't be null")
  }

  return db.rule.update({
    where: {
        id
    },
    data: {
        preFactId_1,
        preFactId_2,
        preExp,
        postFactId_1,
        postFactId_2,
        postExp
    }
  });
};

export const deleteRule = async(id: string): Promise<void> => {
    await db.fact.delete({
        where: {
            id
        }
    });
};