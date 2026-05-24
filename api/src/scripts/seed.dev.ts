import prisma from '@/utils/prisma'
import { v4 } from 'uuid'
import { Province, UserRole } from '@prisma/client'
import { AuthService } from 'arkos/services'

const auth = new AuthService()

const specialties: { name: string; id: string }[] = [
  { name: 'Clínica Geral', id: v4() },
  { name: 'Pediatria', id: v4() },
  { name: 'Ginecologia', id: v4() },
  { name: 'Cardiologia', id: v4() },
  { name: 'Dermatologia', id: v4() },
  { name: 'Ortopedia', id: v4() },
  { name: 'Neurologia', id: v4() },
  { name: 'Psiquiatria', id: v4() },
  { name: 'Oftalmologia', id: v4() },
  { name: 'Endocrinologia', id: v4() },
  { name: 'Nutrição', id: v4() },
  { name: 'Fisioterapia', id: v4() },
  { name: 'Odontologia', id: v4() },
  { name: 'Fonoaudiologia', id: v4() },
]

const consultations: { id: string; name: string }[] = [
  { id: v4(), name: 'Consulta de rotina' },
  { id: v4(), name: 'Consulta de emergência' },
  { id: v4(), name: 'Consulta de acompanhamento' },
  { id: v4(), name: 'Consulta de especialidade' },
  { id: v4(), name: 'Consulta de retorno' },
  { id: v4(), name: 'Consulta de avaliação' },
  { id: v4(), name: 'Consulta de diagnóstico' },
  { id: v4(), name: 'Consulta de tratamento' },
  { id: v4(), name: 'Consulta de prevenção' },
]

type Person = {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  province?: Province
  city?: string
  neighborhood?: string
}

type User = Person & {
  password: string
  role: UserRole
  isSuperUser: boolean
  isStaff: boolean
}

type DayAvailability = {
  start: string
  end: string
  isAvailable: boolean
}

type DoctorAvailability = {
  monday: DayAvailability
  tuesday: DayAvailability
  wednesday: DayAvailability
  thursday: DayAvailability
  friday: DayAvailability
  saturday: DayAvailability
  sunday: DayAvailability
}

type Doctor = Person & {
  specialtyId: string
  availability: DoctorAvailability
}

const doctors: Doctor[] = [
  {
    firstName: 'João',
    lastName: 'Vilanculos',
    email: 'joao.vilanculos@gmail.com',
    phone: '258857483995',
    specialtyId: specialties[0].id,
    availability: {
      monday: { start: '08:00', end: '17:00', isAvailable: true },
      tuesday: { start: '08:00', end: '17:00', isAvailable: true },
      wednesday: { start: '08:00', end: '17:00', isAvailable: true },
      thursday: { start: '08:00', end: '17:00', isAvailable: true },
      friday: { start: '08:00', end: '17:00', isAvailable: true },
      saturday: { start: '08:00', end: '12:00', isAvailable: true },
      sunday: { start: '08:00', end: '12:00', isAvailable: false },
    },
  },
]

const users: User[] = [
  {
    firstName: 'Niuro',
    lastName: 'Orlando',
    email: 'zeus@kami.com',
    password: 'Niuro123',
    isStaff: true,
    isSuperUser: true,
    role: UserRole.ADMINISTRADOR,
    phone: '258857483995',
    city: 'Maputo',
    province: 'MAPUTO',
    neighborhood: 'Boquitxo',
  },
  {
    firstName: 'Maria',
    lastName: 'Vilanculos',
    email: 'blaze@kami.com',
    password: 'Niuro123',
    isStaff: false,
    isSuperUser: false,
    role: UserRole.UTILIZADOR,
    phone: '258857483995',
    city: 'Maputo',
    province: 'MAPUTO',
    neighborhood: 'Boquitxo',
  },
]

async function seedUsers() {
  for (const user of users) {
    await prisma.user.create({
      data: {
        email: user.email!,
        firstName: user.firstName,
        lastName: user.lastName,
        password: await auth.hashPassword(user.password),
        isActive: true,
        role: user.role,
        isStaff: user.isStaff,
        isSuperUser: user.isSuperUser,
        phone: user.phone,
        province: user.province,
        city: user.city,
        neighborhood: user.neighborhood,
      },
    })
  }
}

async function seedSpecialty() {
  for (const specialty of specialties) {
    await prisma.specialty.create({
      data: {
        id: specialty.id,
        name: specialty.name,
      },
    })
  }
}

async function seedConsultation() {
  for (const consultation of consultations) {
    await prisma.consultationType.create({
      data: {
        id: consultation.id,
        name: consultation.name,
      },
    })
  }
}

async function seedDoctors() {
  for (const doctor of doctors) {
    await prisma.doctor.create({
      data: {
        firstName: doctor.firstName!,
        lastName: doctor.lastName!,
        email: doctor.email,
        phone: doctor.phone,
        specialtyId: doctor.specialtyId,
        availability: doctor.availability,
      },
    })
  }
}

async function resetDatabase() {
  await prisma.appointment.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.triage.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.specialty.deleteMany()
  await prisma.consultationType.deleteMany()
  await prisma.user.deleteMany()
}

async function runSeed() {
  await seedSpecialty()
  await seedConsultation()
  await seedDoctors()
  await seedUsers()
}

async function main() {
  await resetDatabase()
  await runSeed()
}

main()
