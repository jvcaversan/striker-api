import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';

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
    // Verificar se a data é válida
    if (isNaN(birthDateISO.getTime())) {
      throw new Error('Invalid birthDate format. Expected format: dd/mm/yyyy');
    }

    if (existingUser) {
      throw new BadRequestException('Email already exists');
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

  async findOne(id: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Verifica se a data de nascimento está no formato esperado
    if (
      updateUserDto.birthDate &&
      typeof updateUserDto.birthDate === 'string'
    ) {
      const parts = updateUserDto.birthDate.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const isoDate = new Date(`${year}-${month}-${day}`);

        // Verifica se a data criada é válida
        if (isNaN(isoDate.getTime())) {
          throw new BadRequestException(
            'Invalid birthDate format. Expected DD/MM/YYYY',
          );
        }

        updateUserDto.birthDate = isoDate; // Atribui a data no formato correto
      } else {
        throw new BadRequestException(
          'Invalid birthDate format. Expected DD/MM/YYYY',
        );
      }
    }

    // Garantir que sempre retorna um usuário
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
