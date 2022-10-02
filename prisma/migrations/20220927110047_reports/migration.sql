-- CreateTable
CREATE TABLE "Reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "submiterId" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);
