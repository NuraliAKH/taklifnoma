import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Template } from '../../templates/entities/template.entity';
import { User } from '../../users/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  user_data: any;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @Column({ type: 'varchar', length: 255, nullable: true })
  final_asset_url: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  total_price: number;

  @ManyToOne(() => Template, (template) => template.orders, { eager: true, onDelete: 'CASCADE' })
  template: Template;

  @ManyToOne(() => User, { eager: true, nullable: true, onDelete: 'SET NULL' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}

