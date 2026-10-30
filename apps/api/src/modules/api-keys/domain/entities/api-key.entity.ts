import { ApiKeyStatus } from '../types/api-key.types';

export interface ApiKeyProps {
  id: string;
  organizationId: string;
  name: string;
  keyHash: string;
  keyPrefix: string | undefined;
  status: ApiKeyStatus;
  weight: number;
  expiresAt: Date | undefined;
  lastUsedAt: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
  revokedAt: Date | undefined;
}

export class ApiKeyEntity {
  private constructor(private readonly props: ApiKeyProps) {}

  static create(props: ApiKeyProps): ApiKeyEntity {
    return new ApiKeyEntity(props);
  }

  get id(): string { return this.props.id; }
  get organizationId(): string { return this.props.organizationId; }
  get name(): string { return this.props.name; }
  get keyHash(): string { return this.props.keyHash; }
  get keyPrefix(): string | undefined { return this.props.keyPrefix; }
  get status(): ApiKeyStatus { return this.props.status; }
  get weight(): number { return this.props.weight; }
  get expiresAt(): Date | undefined { return this.props.expiresAt; }
  get lastUsedAt(): Date | undefined { return this.props.lastUsedAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
  get revokedAt(): Date | undefined { return this.props.revokedAt; }

  isActive(): boolean {
    return this.props.status === ApiKeyStatus.ACTIVE;
  }

  isExpired(): boolean {
    if (!this.props.expiresAt) return false;
    return new Date() > this.props.expiresAt;
  }

  toObject(): ApiKeyProps {
    return {
      id: this.props.id,
      organizationId: this.props.organizationId,
      name: this.props.name,
      keyHash: this.props.keyHash,
      keyPrefix: this.props.keyPrefix,
      status: this.props.status,
      weight: this.props.weight,
      expiresAt: this.props.expiresAt,
      lastUsedAt: this.props.lastUsedAt,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      revokedAt: this.props.revokedAt,
    };
  }
}
