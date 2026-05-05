import { Prisma } from "@prisma/client";
import { PrismaQueryOptions } from 'arkos/prisma';

const specialtyQueryOptions: PrismaQueryOptions<Prisma.SpecialtyDelegate> = {
  global: {},
  find: {},
  findOne: {},
  findMany: {},
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

export default specialtyQueryOptions;
