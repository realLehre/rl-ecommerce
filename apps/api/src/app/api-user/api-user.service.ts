import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.service";

@Injectable()
export class ApiUserService{
    constructor(private prisma:PrismaService) {
    }

    async getUsers(){
        return this.prisma.user.findMany()
    }

    async getUserById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
}