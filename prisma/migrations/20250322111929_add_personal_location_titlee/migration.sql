/*
  Warnings:

  - Added the required column `title` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "title" TEXT NOT NULL;
