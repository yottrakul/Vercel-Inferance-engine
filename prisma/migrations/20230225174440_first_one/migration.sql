-- CreateTable
CREATE TABLE "Fact" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fact" TEXT,

    CONSTRAINT "Fact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "preFactId_1" TEXT NOT NULL,
    "preExp" TEXT,
    "preFactId_2" TEXT,
    "postFactId_1" TEXT NOT NULL,
    "postExp" TEXT,
    "postFactId_2" TEXT,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fact_label_key" ON "Fact"("label");

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_preFactId_1_fkey" FOREIGN KEY ("preFactId_1") REFERENCES "Fact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_preFactId_2_fkey" FOREIGN KEY ("preFactId_2") REFERENCES "Fact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_postFactId_1_fkey" FOREIGN KEY ("postFactId_1") REFERENCES "Fact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_postFactId_2_fkey" FOREIGN KEY ("postFactId_2") REFERENCES "Fact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
