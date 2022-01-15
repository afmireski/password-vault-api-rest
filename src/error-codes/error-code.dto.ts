export class ErrorCodeDto {
  constructor(
    private readonly code: number,
    private readonly message: string,
  ) {}
}
