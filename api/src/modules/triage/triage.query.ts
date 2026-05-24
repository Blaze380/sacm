import { Prisma } from "@prisma/client";
import { PrismaQueryOptions } from 'arkos/prisma';

const triageInclude = {
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
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  specialty: {
    select: {
      id: true,
      name: true,
    },
  },
  consultationType: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.TriageInclude;

const triageQueryOptions: PrismaQueryOptions<Prisma.TriageDelegate> = {
  global: {},
  find: {
    include: triageInclude,
  },
  findOne: {
    include: triageInclude,
  },
  findMany: {
    include: triageInclude,
  },
  update: {},
  updateMany: {},
  updateOne: {},
  create: {},
  createMany: {},
  createOne: {},
  save: {},
  saveMany: {},
  saveOne: {},
  delete: {},
  deleteMany: {},
  deleteOne: {},
}

export default triageQueryOptions;
