-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "isFavorite" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "isFavorite" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "isFavorite" DROP NOT NULL;
