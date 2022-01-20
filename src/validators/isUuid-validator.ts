import { IsUUID } from 'class-validator';

export class IsUuid {
  constructor(_id: string) {
    this.id = _id;
  }

  @IsUUID('4')
  id: string;
}
