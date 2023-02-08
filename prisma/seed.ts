import { db } from "../src/utils/db.server";

type Fact = {
  label: string;
  fact?: string;
};

// Fact เริ่มต้นใส่ตรงนี้

const rootLabel: string[] = ["w", "q", "d", "m"];
const terminal: string[] = ["s", "r"];
const intermediate: string[] = ["x", "y", "g", "z", "a", "b", "e", "c", "f"]
const allFacts: string[] = [...rootLabel,...terminal,...intermediate];

// สิ้นสุด

async function seed() {

  await Promise.all(
    getFacts().map(fact => {
      return db.fact.create({
        data: {
          label: fact.label,
          fact: fact.fact
        }
      })
    })
  )
}

seed();

function getFacts(): Array<Fact> {
  return allFacts.map(fact => {
    return {
      label: fact,
    }
  })
}
