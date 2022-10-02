-- CreateTable
CREATE TABLE "Restrictions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "restrictions" BOOLEAN NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Restrictions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Restrictions" ADD CONSTRAINT "Restrictions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
