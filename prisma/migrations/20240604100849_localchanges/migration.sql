-- CreateTable
CREATE TABLE "ForgotPassword" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForgotPassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPassword_userID_key" ON "ForgotPassword"("userID");

-- AddForeignKey
ALTER TABLE "ForgotPassword" ADD CONSTRAINT "ForgotPassword_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
