import prisma from "@/utils/prisma";
import { v4 } from "uuid"
import { Province, UserRole } from "@prisma/client";
import { AuthService } from "arkos/services"
import { UserService } from "@/modules/user/user.service";

const auth = new AuthService();
const userAuth=new UserService("user");

const specialties: { name: string, id: string }[] = [
    { name: "Clínica Geral", id: v4() },
    { name: "Pediatria", id: v4() },
    { name: "Ginecologia", id: v4() },
    { name: "Cardiologia", id: v4() },
    { name: "Dermatologia", id: v4() },
    { name: "Ortopedia", id: v4() },
    { name: "Neurologia", id: v4() },
    { name: "Psiquiatria", id: v4() },
    { name: "Oftalmologia", id: v4() },
    { name: "Endocrinologia", id: v4() },
    { name: "Nutrição", id: v4() },
    { name: "Fisioterapia", id: v4() },
    { name: "Odontologia", id: v4() },
    { name: "Fonoaudiologia", id: v4() },
]

const consultations: { id: string, name: string }[] = [
    { id: v4(), name: "Consulta de rotina" },
    { id: v4(), name: "Consulta de emergência" },
    { id: v4(), name: "Consulta de acompanhamento" },
    { id: v4(), name: "Consulta de especialidade" },
    { id: v4(), name: "Consulta de retorno" },
    { id: v4(), name: "Consulta de avaliação" },
    { id: v4(), name: "Consulta de diagnóstico" },
    { id: v4(), name: "Consulta de tratamento" },
    { id: v4(), name: "Consulta de prevenção" },
]
type Person = {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    province?: Province;
    city?: string;
    neighborhood?: string;

}
type User = Person & {
    password: string;
    role: UserRole;
    isSuperUser: boolean;
    isStaff: boolean;
}
type Doctor = Person & {
    specialtyId: string;
    doctorAvailability: DoctorAvailability;
}
type DayAvailability = {
    start: string;
    end: string;
    isAvailable: boolean;
}
type DoctorAvailability = {
    monday: DayAvailability;
    tuesday: DayAvailability;
    wednesday: DayAvailability;
    thursday: DayAvailability;
    friday: DayAvailability;
    saturday: DayAvailability;
    sunday: DayAvailability;
}
const doctors: Doctor[] = [
    {
        firstName: "João",
        lastName: "Vilanculos",
        email: "joao.vilanculos@gmail.com",
        phone: "258857483995",
        province: "MAPUTO",
        city: "Maputo",
        neighborhood: "Central",
        specialtyId: specialties[0].id,
        doctorAvailability: {
            monday: { start: "08:00", end: "17:00", isAvailable: true },
            tuesday: { start: "08:00", end: "17:00", isAvailable: true },
            wednesday: { start: "08:00", end: "17:00", isAvailable: true },
            thursday: { start: "08:00", end: "17:00", isAvailable: true },
            friday: { start: "08:00", end: "17:00", isAvailable: true },
            saturday: { start: "08:00", end: "12:00", isAvailable: true },
            sunday: { start: "08:00", end: "12:00", isAvailable: false }
        }
    }
]
const users: User[] = [
    {
        firstName: "Niuro",
        lastName: "Orlando",
        email: "zeus@kami.com",
        password: "Niuro123",
        isStaff: true,
        isSuperUser: true,
        role: UserRole.ADMINISTRADOR,
        phone: "258857483995",
        city: "Maputo",
        province: "MAPUTO",
        neighborhood: "Boquitxo",
    },
    {
        firstName: "Maria",
        lastName: "Vilanculos",
        email: "blaze@kami.com",
        password: "Niuro123",
        isStaff: false,
        isSuperUser: false,
        role: UserRole.UTILIZADOR,
        phone: "258857483995",
        city: "Maputo",
        province: "MAPUTO",
        neighborhood: "Boquitxo",
    }
]

async function seedUsers () {
    try {
        users.forEach(async (user) => {
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
                }
            });
        });
    } catch (error) {
        console.error("Error seeding users:", error);
    }
}

async function seedSpecialty () {
    try {
        specialties.forEach(async (specialty) => {
            await prisma.specialty.create({
                data: {
                    id: specialty.id,
                    name: specialty.name,
                }
            })
        });
    } catch (error) {
        console.error("Error seeding specialties:", error);
    }
}

async function seedConsultation () {
    try {
        consultations.forEach(async (consultation) => {
            await prisma.consultationType.create({
                data: {
                    id: consultation.id,
                    name: consultation.name,
                }
            })
        });
    } catch (error) {
        console.error("Error seeding consultation types:", error);
    }
}

async function seedDoctors () {
    try {
        doctors.forEach(async (doctor) => {
            await prisma.user.create({
                data: {
                    email: doctor.email!,
                    firstName: doctor.firstName,
                    lastName: doctor.lastName,
                    password: "password",
                    isActive: false,

                    phone: doctor.phone,
                    province: doctor.province,
                    city: doctor.city,
                    neighborhood: doctor.neighborhood,
                    doctorAvailability: doctor.doctorAvailability,
                }
            })
        });
    } catch (error) {
        console.error("Error seeding doctors:", error);
    }

}

async function resetDatabase () {
    try {
        await prisma.appointment.deleteMany();
        await prisma.notification.deleteMany();
        await prisma.specialty.deleteMany();
        await prisma.consultationType.deleteMany();
        await prisma.user.deleteMany();
        await prisma.triage.deleteMany();
    } catch (error) {
        console.error("Error resetting database:", error);
    }
}

async function runSeed () {
    await seedSpecialty();
    await seedConsultation();
    await seedDoctors();
    await seedUsers();
}

async function main () {
    await resetDatabase();
    await runSeed();
}
main()