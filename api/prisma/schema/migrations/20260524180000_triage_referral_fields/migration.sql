-- AlterTable
ALTER TABLE "Triage" ADD COLUMN     "specialtyId" TEXT,
ADD COLUMN     "consultationTypeId" TEXT,
ADD COLUMN     "priority" "PriorityLevel",
ADD COLUMN     "rejectionReason" TEXT;

-- AddForeignKey
ALTER TABLE "Triage" ADD CONSTRAINT "Triage_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Triage" ADD CONSTRAINT "Triage_consultationTypeId_fkey" FOREIGN KEY ("consultationTypeId") REFERENCES "ConsultationType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
