export class QuotaCheckResponseDto {
  constructor(
    public readonly allowed: boolean,
    public readonly cost: number,
    public readonly remaining: number,
    public readonly limit: number,
    public readonly used: number,
    public readonly reason?: string,
  ) {}

  static allowed(cost: number, remaining: number, limit: number, used: number): QuotaCheckResponseDto {
    return new QuotaCheckResponseDto(true, cost, remaining, limit, used);
  }

  static rejected(reason: string, cost: number, remaining: number, limit: number, used: number): QuotaCheckResponseDto {
    return new QuotaCheckResponseDto(false, cost, remaining, limit, used, reason);
  }
}
