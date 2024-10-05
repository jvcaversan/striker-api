import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    // Verifica se o campo birthDate está no formato string
    if (typeof data.birthDate === 'string') {
      const parts = data.birthDate.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const isoDate = new Date(`${year}-${month}-${day}`);

        // Verifica se a data criada é válida
        if (isNaN(isoDate.getTime())) {
          throw new BadRequestException(
            'Invalid birthDate format. Expected DD/MM/YYYY',
          );
        }

        data.birthDate = isoDate; // Atribui a data no formato correto
      } else {
        throw new BadRequestException(
          'Invalid birthDate format. Expected DD/MM/YYYY',
        );
      }
    }

    // Hash da senha antes de salvar no banco de dados
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await this.prisma.user.create({
      data,
    });
  }
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        group: true,
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        group: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: Prisma.UserUpdateInput, // Use o DTO correto aqui
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Validação e conversão da data de nascimento
    if (
      updateUserDto.birthDate &&
      typeof updateUserDto.birthDate === 'string'
    ) {
      const parts = updateUserDto.birthDate.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const isoDate = new Date(`${year}-${month}-${day}`);

        if (isNaN(isoDate.getTime())) {
          throw new BadRequestException(
            'Invalid birthDate format. Expected DD/MM/YYYY',
          );
        }

        updateUserDto.birthDate = isoDate;
      } else {
        throw new BadRequestException(
          'Invalid birthDate format. Expected DD/MM/YYYY',
        );
      }
    }

    // Verifica se uma nova senha foi fornecida e criptografa
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // Atualiza o usuário com os dados modificados
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
