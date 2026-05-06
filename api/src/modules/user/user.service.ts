import { BaseService } from "arkos/services";
import { Prisma } from "@prisma/client"

export class UserService extends BaseService<"user"> {}

const userService = new UserService("user");

export default userService;
