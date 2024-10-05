import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [UsersModule, GroupsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
