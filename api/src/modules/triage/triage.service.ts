import { BaseService } from "arkos/services";
import { PriorityLevel, TriageStatus } from "@prisma/client";
import { AppError } from "arkos/error-handler";
import prisma from "@/utils/prisma";

const REVIEWABLE_STATUSES: TriageStatus[] = [
  TriageStatus.PENDENTE,
  TriageStatus.EM_ANALISE,
];

const STAFF_ONLY_UPDATE_FIELDS = new Set([
  "status",
  "analyzedBy",
  "analyzedById",
  "specialtyId",
  "consultationTypeId",
  "priority",
  "rejectionReason",
]);

export class TriageService extends BaseService<"triage"> {
  private async findReviewable(id: string) {
    const triage = await prisma.triage.findUnique({ where: { id } });
    if (!triage) {
      throw new AppError("Triage not found", 404);
    }
    if (!REVIEWABLE_STATUSES.includes(triage.status)) {
      throw new AppError(
        "Only pending or in-review triages can be updated",
        400,
      );
    }
    return triage;
  }

  private async assertSpecialtyExists(specialtyId: string) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
    });
    if (!specialty) {
      throw new AppError("Specialty not found", 404);
    }
  }

  private async assertConsultationTypeExists(consultationTypeId: string) {
    const consultationType = await prisma.consultationType.findUnique({
      where: { id: consultationTypeId },
    });
    if (!consultationType) {
      throw new AppError("Consultation type not found", 404);
    }
  }

  async approveTriage(
    id: string,
    data: {
      specialtyId: string;
      consultationTypeId: string;
      priority: PriorityLevel;
    },
    analyzedById: string,
  ) {
    await this.findReviewable(id);
    await this.assertSpecialtyExists(data.specialtyId);
    await this.assertConsultationTypeExists(data.consultationTypeId);

    return prisma.triage.update({
      where: { id },
      data: {
        status: TriageStatus.REENCAMINHADO,
        specialtyId: data.specialtyId,
        consultationTypeId: data.consultationTypeId,
        priority: data.priority,
        analyzedById,
        rejectionReason: null,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        analyzedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        specialty: { select: { id: true, name: true } },
        consultationType: { select: { id: true, name: true } },
      },
    });
  }

  async rejectTriage(
    id: string,
    analyzedById: string,
    rejectionReason?: string,
  ) {
    await this.findReviewable(id);

    return prisma.triage.update({
      where: { id },
      data: {
        status: TriageStatus.CANCELADO,
        analyzedById,
        rejectionReason: rejectionReason?.trim() || null,
        specialtyId: null,
        consultationTypeId: null,
        priority: null,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        analyzedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        specialty: { select: { id: true, name: true } },
        consultationType: { select: { id: true, name: true } },
      },
    });
  }

  async startReview(id: string, analyzedById: string) {
    const triage = await prisma.triage.findUnique({ where: { id } });
    if (!triage) {
      throw new AppError("Triage not found", 404);
    }
    if (triage.status !== TriageStatus.PENDENTE) {
      return triage;
    }

    return prisma.triage.update({
      where: { id },
      data: {
        status: TriageStatus.EM_ANALISE,
        analyzedById,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        analyzedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        specialty: { select: { id: true, name: true } },
        consultationType: { select: { id: true, name: true } },
      },
    });
  }

  static isStaffOnlyField(field: string): boolean {
    return STAFF_ONLY_UPDATE_FIELDS.has(field);
  }
}

const triageService = new TriageService("triage");

export default triageService;
