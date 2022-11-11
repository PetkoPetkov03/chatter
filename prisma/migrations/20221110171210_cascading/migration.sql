-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_userId_fkey";

-- DropForeignKey
ALTER TABLE "Restrictions" DROP CONSTRAINT "Restrictions_userId_fkey";

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restrictions" ADD CONSTRAINT "Restrictions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
