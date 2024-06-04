-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userID_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_userID_fkey";

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
