import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, MatchGroup } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async createGroup(
    ownerId: number,
    data: Prisma.MatchGroupCreateWithoutOwnerInput,
  ): Promise<MatchGroup> {
    return this.prisma.matchGroup.create({
      data: {
        ...data,
        ownerId,
      },
    });
  }

  async findAll(): Promise<MatchGroup[]> {
    return this.prisma.matchGroup.findMany({
      include: {
        owner: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<MatchGroup> {
    const group = await this.prisma.matchGroup.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });
    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }
    return group;
  }

  async update(
    id: number,
    data: Prisma.MatchGroupUpdateInput,
  ): Promise<MatchGroup> {
    return this.prisma.matchGroup.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<MatchGroup> {
    return this.prisma.matchGroup.delete({
      where: { id },
    });
  }
}
