import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  // Criar usuário
  async create(createUserDto: CreateUserDto) {
    // Função para converter dd/mm/aaaa para o formato ISO yyyy-mm-dd
    const [day, month, year] = createUserDto.birthDate.split('/');
    const birthDateISO = new Date(`${year}-${month}-${day}`);

    const existingUser = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Verificar se a data é válida
    if (isNaN(birthDateISO.getTime())) {
      throw new Error('Invalid birthDate format. Expected format: dd/mm/yyyy');
    }

    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        birthDate: birthDateISO, // Enviar a data convertida para o Prisma
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
