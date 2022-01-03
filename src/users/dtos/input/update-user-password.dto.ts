import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty({
    description: 'The current user password',
    nullable: false,
    minLength: 6,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  current_password: string;

  @ApiProperty({
    description: 'The new user password',
    nullable: false,
    minLength: 6,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  new_password: string;

  @ApiProperty({
    description: 'Repeat the new user password to confirm',
    nullable: false,
    minLength: 6,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  confirm_new_password: string;
}
