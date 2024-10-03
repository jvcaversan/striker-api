import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString() // Use IsDateString para validação de datas no formato ISO
  birthDate: string; // Date será string no DTO para facilitar o envio em JSON

  @IsOptional()
  @IsString()
  photo?: string;
}
