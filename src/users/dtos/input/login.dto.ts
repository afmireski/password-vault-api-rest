import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email of user',
    nullable: false,
    example: 'user@email.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of user',
    nullable: false,
    minLength: 6,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
