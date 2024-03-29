-- CreateTable
CREATE TABLE "Replies" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "likes" BIGINT NOT NULL DEFAULT 0,
    "dislike" BIGINT NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Replies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "Replies_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "comment" FOREIGN KEY ("id") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
