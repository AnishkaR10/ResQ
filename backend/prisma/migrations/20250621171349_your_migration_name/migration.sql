/*
  Warnings:

  - You are about to drop the `notification_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_userId_fkey";

-- DropTable
DROP TABLE "notification_logs";

-- DropTable
DROP TABLE "subscriptions";
