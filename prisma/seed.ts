import { db } from "../src/utils/db.server";

type Fact = {
  label: string;
  fact?: string;
  type: number;
};

// Fact เริ่มต้นใส่ตรงนี้

const rootLabel: string[] = ["w", "q", "d", "m"];
const terminal: string[] = ["s", "r"];
const intermediate: string[] = ["x", "y", "g", "z", "a", "b", "e", "c", "f"]

// สิ้นสุด

async function seed() {
  
  await Promise.all(
    getRootNode().map(node => {
      return db.fact.create({
        data: {
          label: node.label,
          type: 0
        }
      });
    })
  );

  await Promise.all(
    getIntermediateNode().map(node => {
      return db.fact.create({
        data: {
          label: node.label
        }
      });
    })
  );

  await Promise.all(
    getTerminalNode().map(node => {
      return db.fact.create({
        data: {
          label: node.label,
          type: 2
        }
      });
    })
  );
  
}

seed();

function getRootNode(): Array<Fact>{
  const result: Array<Fact> = rootLabel.map(item => {
    return {
      label: item,
      type: 0
    }
  })
  return result;
}

function getIntermediateNode(): Array<Fact>{
  const result: Array<Fact> = intermediate.map(item => {
    return {
      label: item,
      type: 1
    }
  })
  return result;
}

function getTerminalNode(): Array<Fact>{
  const result: Array<Fact> = terminal.map(item => {
    return {
      label: item,
      type: 2
    }
  })
  return result;
}
