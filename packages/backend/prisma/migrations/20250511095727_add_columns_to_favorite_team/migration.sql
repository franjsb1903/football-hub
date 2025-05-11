/*
  Warnings:

  - Added the required column `code` to the `FavoriteTeam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `FavoriteTeam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `FavoriteTeam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamLogo` to the `FavoriteTeam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FavoriteTeam" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "teamLogo" TEXT NOT NULL;
