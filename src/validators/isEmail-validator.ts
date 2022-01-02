import { IsEmail } from 'class-validator';

export class IsEmailValidator {
  @IsEmail()
  email: string;
}
