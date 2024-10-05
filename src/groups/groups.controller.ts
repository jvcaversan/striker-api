import { UpdateGroupDto } from './dto/update-group.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createGroup(@Body() { ownerId, ...createGroupData }: CreateGroupDto) {
    return this.groupsService.createGroup(ownerId, createGroupData);
  }

  @Get()
  findAllGroups() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findGroupById(@Param('id') id: string) {
    return this.groupsService.findOne(+id);
  }

  @Patch(':id')
  updateGroup(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  removeGroup(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }
}
