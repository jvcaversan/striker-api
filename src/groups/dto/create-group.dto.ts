import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  ownerId: number;
}
