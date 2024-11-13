import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlsService } from './urls.service';

@ApiTags('urls')
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a shortened URL' })
  async create(@Body() createUrlDto: CreateUrlDto, @CurrentUser() user?: User) {
    const url = await this.urlsService.create(createUrlDto, user);
    return {
      ...url,
      shortUrl: this.urlsService.getFullShortUrl(url.shortCode),
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all URLs for authenticated user' })
  async findAll(@CurrentUser() user: User) {
    const urls = await this.urlsService.findAll(user);
    return urls.map((url) => ({
      ...url,
      shortUrl: this.urlsService.getFullShortUrl(url.shortCode),
    }));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update URL' })
  async update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @CurrentUser() user: User,
  ) {
    const url = await this.urlsService.update(id, user, updateUrlDto);
    return {
      ...url,
      shortUrl: this.urlsService.getFullShortUrl(url.shortCode),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete URL' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.urlsService.remove(id, user);
    return { message: 'URL deleted successfully' };
  }
}
