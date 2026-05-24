-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_doctorSpecialtyId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT IF EXISTS "Appointment_doctorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN IF EXISTS "doctorAvailability",
DROP COLUMN IF EXISTS "doctorSpecialtyId";

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "availability" JSONB,
    "specialtyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
