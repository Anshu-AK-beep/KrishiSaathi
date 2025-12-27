-- CreateTable
CREATE TABLE "public"."chat_history" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "messages" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_history_user_id_idx" ON "public"."chat_history"("user_id");

-- CreateIndex
CREATE INDEX "chat_history_updated_at_idx" ON "public"."chat_history"("updated_at");

-- AddForeignKey
ALTER TABLE "public"."chat_history" ADD CONSTRAINT "chat_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
