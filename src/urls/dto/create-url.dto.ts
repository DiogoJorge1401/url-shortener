import { IsUrl, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({ example: 'https://example.com/very-long-url' })
  @IsUrl()
  originalUrl: string;

  @ApiPropertyOptional({ example: 'custom' })
  @IsOptional()
  @Length(1, 6)
  shortCode?: string;
}
