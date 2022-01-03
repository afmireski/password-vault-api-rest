import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The new name of user',
    nullable: true,
    example: 'John Doe',
    minLength: 3,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'The email of new user',
    nullable: true,
    example: 'johndoe@email.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;
}
