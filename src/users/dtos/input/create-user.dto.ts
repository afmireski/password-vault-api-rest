import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of new user',
    nullable: false,
    example: 'John Doe',
    minLength: 3,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'The email of new user',
    nullable: false,
    example: 'johndoe@email.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of new user',
    nullable: false,
    minLength: 6,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
