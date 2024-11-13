import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto {
  @ApiProperty({ example: 'https://example.com/new-url' })
  @IsUrl()
  originalUrl: string;
}
