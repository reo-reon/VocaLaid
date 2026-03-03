-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('ATTENDING', 'NOT_ATTENDING');

-- CreateEnum
CREATE TYPE "GuestCategory" AS ENUM ('GROOM', 'BRIDE');

-- CreateEnum
CREATE TYPE "AgeCategory" AS ENUM ('ADULT', 'CHILD', 'INFANT');

-- CreateEnum
CREATE TYPE "DietaryRestriction" AS ENUM ('WITH', 'WITHOUT');

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artistId" INTEGER NOT NULL,
    "originalUrl" TEXT,
    "duration" INTEGER,
    "difficulty" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RsvpGuest" (
    "id" SERIAL NOT NULL,
    "status" "RsvpStatus" NOT NULL DEFAULT 'ATTENDING',
    "guestCategory" "GuestCategory" NOT NULL,
    "japaneseLastName" TEXT NOT NULL,
    "japaneseFirstName" TEXT NOT NULL,
    "kanaLastName" TEXT NOT NULL,
    "kanaFirstName" TEXT NOT NULL,
    "email" TEXT,
    "zipcode" TEXT,
    "address" TEXT,
    "building" TEXT,
    "phone" TEXT,
    "ageCategory" "AgeCategory",
    "dietaryRestrictions" "DietaryRestriction" NOT NULL DEFAULT 'WITHOUT',
    "allergyInfo" TEXT,
    "afterParty" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "primaryGuestId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RsvpGuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToSong" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Artist_name_idx" ON "Artist"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Song_title_idx" ON "Song"("title");

-- CreateIndex
CREATE INDEX "RsvpGuest_email_idx" ON "RsvpGuest"("email");

-- CreateIndex
CREATE INDEX "RsvpGuest_guestCategory_idx" ON "RsvpGuest"("guestCategory");

-- CreateIndex
CREATE INDEX "RsvpGuest_primaryGuestId_idx" ON "RsvpGuest"("primaryGuestId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToSong_AB_unique" ON "_CategoryToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToSong_B_index" ON "_CategoryToSong"("B");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RsvpGuest" ADD CONSTRAINT "RsvpGuest_primaryGuestId_fkey" FOREIGN KEY ("primaryGuestId") REFERENCES "RsvpGuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToSong" ADD CONSTRAINT "_CategoryToSong_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToSong" ADD CONSTRAINT "_CategoryToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

