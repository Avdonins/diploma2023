-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authToken" VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN     "token" VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN     "tokenExp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
