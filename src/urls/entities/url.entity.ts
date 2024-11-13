import { Entity, Column, ManyToOne, BeforeInsert } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { nanoid } from 'nanoid';

@Entity('urls')
export class Url extends BaseEntity {
  @Column()
  originalUrl: string;

  @Column({ unique: true, length: 6 })
  shortCode: string;

  @Column({ default: 0 })
  clicks: number;

  @ManyToOne('User', 'urls', { nullable: true })
  user: User;

  @BeforeInsert()
  generateShortCode() {
    if (!this.shortCode) {
      this.shortCode = nanoid(6);
    }
  }
}
