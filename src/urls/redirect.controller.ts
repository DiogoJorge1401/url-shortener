import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UrlsService } from './urls.service';

@ApiTags('redirect')
@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':shortCode')
  @ApiOperation({ summary: 'Redirect to original URL' })
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const url = await this.urlsService.findByShortCode(shortCode);
    await this.urlsService.incrementClicks(shortCode);
    res.redirect(url.originalUrl);
  }
}
