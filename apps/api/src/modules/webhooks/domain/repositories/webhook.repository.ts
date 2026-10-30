import { WebhookEntity } from '../entities/webhook.entity';

export abstract class WebhookRepository {
  abstract findById(id: string): Promise<WebhookEntity | null>;

  abstract findByOrganizationId(organizationId: string): Promise<WebhookEntity[]>;

  abstract create(webhook: WebhookEntity): Promise<WebhookEntity>;

  abstract update(webhook: WebhookEntity): Promise<WebhookEntity>;

  abstract delete(id: string): Promise<void>;

  abstract existsByName(organizationId: string, name: string): Promise<boolean>;

  abstract findByEvent(organizationId: string, event: string): Promise<WebhookEntity[]>;
}
