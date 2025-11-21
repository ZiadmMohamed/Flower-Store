import { ApiProperty } from '@nestjs/swagger';
import { JobProgress, JobState } from 'bullmq';

export class GetOrderStatusResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  state: JobState | 'unknown';

  @ApiProperty()
  progress: JobProgress;

  @ApiProperty()
  result: string;

  @ApiProperty()
  failedReason: string | null;
}
