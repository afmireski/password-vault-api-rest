import { IsEmail } from 'class-validator';

export class IsEmailValidator {
  @IsEmail()
  id: string;
}
