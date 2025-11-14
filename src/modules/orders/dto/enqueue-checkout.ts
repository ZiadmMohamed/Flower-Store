import { ApiProperty } from '@nestjs/swagger';

export enum EnqueueCheckoutStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class EnqueueCheckoutResponse {
  @ApiProperty({ type: String })
  jobId: string;

  @ApiProperty({ enum: EnqueueCheckoutStatus })
  status: EnqueueCheckoutStatus;

  @ApiProperty()
  message?: string;
}
