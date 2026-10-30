import { QuotaPeriod, QuotaProps, CreateQuotaInput } from '../types/quota.types';

export class QuotaEntity {
  private constructor(private readonly props: QuotaProps) {}

  static create(input: CreateQuotaInput): QuotaEntity {
    const period = input.period ?? QuotaPeriod.MONTHLY;
    const { periodStart, periodEnd } = input.periodStart && input.periodEnd
      ? { periodStart: input.periodStart, periodEnd: input.periodEnd }
      : QuotaEntity.calculatePeriodDates(period);

    const now = new Date();
    return new QuotaEntity({
      id: crypto.randomUUID(),
      organizationId: input.organizationId,
      limit: BigInt(input.limit),
      period,
      defaultCost: input.defaultCost ?? 1,
      periodStart,
      periodEnd,
      used: BigInt(0),
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPrisma(data: any): QuotaEntity {
    return new QuotaEntity({
      id: data.id,
      organizationId: data.organizationId,
      limit: BigInt(data.limit),
      period: data.period as QuotaPeriod,
      defaultCost: data.defaultCost,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      used: BigInt(data.used),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get id(): string { return this.props.id; }
  get organizationId(): string { return this.props.organizationId; }
  get limit(): bigint { return this.props.limit; }
  get period(): QuotaPeriod { return this.props.period; }
  get defaultCost(): number { return this.props.defaultCost; }
  get periodStart(): Date { return this.props.periodStart; }
  get periodEnd(): Date { return this.props.periodEnd; }
  get used(): bigint { return this.props.used; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  remaining(): bigint {
    const rem = this.props.limit - this.props.used;
    return rem > BigInt(0) ? rem : BigInt(0);
  }

  canConsume(cost: number): boolean {
    if (this.props.period === QuotaPeriod.UNLIMITED) return true;
    return this.props.used + BigInt(cost) <= this.props.limit;
  }

  isPeriodExpired(): boolean {
    if (this.props.period === QuotaPeriod.UNLIMITED) return false;
    return new Date() > this.props.periodEnd;
  }

  static calculatePeriodDates(period: QuotaPeriod, fromDate: Date = new Date()): { periodStart: Date; periodEnd: Date } {
    const start = new Date(fromDate);
    const end = new Date(fromDate);

    switch (period) {
      case QuotaPeriod.DAILY:
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999);
        break;
      case QuotaPeriod.WEEKLY: {
        const day = start.getUTCDay();
        const diff = start.getUTCDate() - day + (day === 0 ? -6 : 1);
        start.setUTCDate(diff);
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCDate(start.getUTCDate() + 6);
        end.setUTCHours(23, 59, 59, 999);
        break;
      }
      case QuotaPeriod.MONTHLY:
        start.setUTCDate(1);
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCMonth(start.getUTCMonth() + 1, 0);
        end.setUTCHours(23, 59, 59, 999);
        break;
      case QuotaPeriod.YEARLY:
        start.setUTCMonth(0, 1);
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCMonth(11, 31);
        end.setUTCHours(23, 59, 59, 999);
        break;
      case QuotaPeriod.UNLIMITED:
      default:
        start.setFullYear(2000, 0, 1);
        end.setFullYear(2099, 11, 31);
        break;
    }

    return { periodStart: start, periodEnd: end };
  }

  toObject(): QuotaProps {
    return {
      id: this.props.id,
      organizationId: this.props.organizationId,
      limit: this.props.limit,
      period: this.props.period,
      defaultCost: this.props.defaultCost,
      periodStart: this.props.periodStart,
      periodEnd: this.props.periodEnd,
      used: this.props.used,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
