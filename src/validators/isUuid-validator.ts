import { IsUUID } from 'class-validator';

export class IsUuid {
  @IsUUID('4')
  id: string;
}
