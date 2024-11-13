import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Url } from './entities/url.entity';
import { User } from '../users/entities/user.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUrlDto: CreateUrlDto, user?: User): Promise<Url> {
    if (createUrlDto.shortCode) {
      const existing = await this.urlRepository.findOne({
        where: { shortCode: createUrlDto.shortCode },
        withDeleted: true,
      });
      if (existing) {
        throw new ConflictException('Short code already exists');
      }
    }

    const url = this.urlRepository.create({
      ...createUrlDto,
      user,
    });

    return this.urlRepository.save(url);
  }

  async findAll(user: User): Promise<Url[]> {
    return this.urlRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByShortCode(shortCode: string): Promise<Url> {
    const url = await this.urlRepository.findOne({
      where: { shortCode },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    return url;
  }

  async incrementClicks(shortCode: string): Promise<void> {
    await this.urlRepository.increment({ shortCode }, 'clicks', 1);
  }

  async update(
    id: string,
    user: User,
    updateUrlDto: UpdateUrlDto,
  ): Promise<Url> {
    const url = await this.urlRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    url.originalUrl = updateUrlDto.originalUrl;
    return this.urlRepository.save(url);
  }

  async remove(id: string, user: User): Promise<void> {
    const url = await this.urlRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    await this.urlRepository.softDelete(id);
  }

  getFullShortUrl(shortCode: string): string {
    const prefix = this.configService.get('URL_PREFIX');
    return `${prefix}/${shortCode}`;
  }
}
