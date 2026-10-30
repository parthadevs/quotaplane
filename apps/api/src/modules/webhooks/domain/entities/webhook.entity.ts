import { WebhookStatus, WebhookProps } from '../types/webhook.types';

export class WebhookEntity {
  private constructor(private readonly props: WebhookProps) {}

  static create(props: WebhookProps): WebhookEntity {
    return new WebhookEntity(props);
  }

  static fromPrisma(data: any): WebhookEntity {
    return new WebhookEntity({
      id: data.id,
      organizationId: data.organizationId,
      name: data.name,
      url: data.url,
      secret: data.secret,
      status: data.status as WebhookStatus,
      events: data.events ?? [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get id(): string { return this.props.id; }
  get organizationId(): string { return this.props.organizationId; }
  get name(): string { return this.props.name; }
  get url(): string { return this.props.url; }
  get secret(): string { return this.props.secret; }
  get status(): WebhookStatus { return this.props.status; }
  get events(): string[] { return this.props.events; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  isActive(): boolean {
    return this.props.status === WebhookStatus.ACTIVE;
  }

  subscribesTo(event: string): boolean {
    return this.props.events.includes(event) || this.props.events.includes('*');
  }

  toObject(): WebhookProps {
    return {
      id: this.props.id,
      organizationId: this.props.organizationId,
      name: this.props.name,
      url: this.props.url,
      secret: this.props.secret,
      status: this.props.status,
      events: this.props.events,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
