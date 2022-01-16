import { IsEmail } from 'class-validator';

export class IsEmailValidator {
  constructor(_email: string) {
    this.email = _email;
  }

  @IsEmail()
  email: string;
}
