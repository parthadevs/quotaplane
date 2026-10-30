export enum WebhookStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export enum WebhookDeliveryStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface WebhookProps {
  id: string;
  organizationId: string;
  name: string;
  url: string;
  secret: string;
  status: WebhookStatus;
  events: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDeliveryProps {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  status: WebhookDeliveryStatus;
  attempts: number;
  responseCode?: number;
  responseBody?: string;
  nextRetryAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
