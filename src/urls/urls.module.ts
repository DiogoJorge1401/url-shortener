import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { RedirectController } from './redirect.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  controllers: [UrlsController, RedirectController],
  providers: [UrlsService],
})
export class UrlsModule {}
