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
    example: 'Updated User',
    minLength: 3,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'The new email of user',
    nullable: true,
    example: 'updateduser@email.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;
}
