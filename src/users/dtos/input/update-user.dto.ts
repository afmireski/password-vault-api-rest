import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @IsOptional()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;
}
