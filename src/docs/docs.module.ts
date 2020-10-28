import { Module } from '@nestjs/common';
import { DocsService } from './docs.service';
import { DocsController } from './docs.controller';
import { DocRepository } from './doc.repository';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [DocsService],
  controllers: [DocsController],
  imports: [
    TypeOrmModule.forFeature([DocRepository]),
    AuthModule,
  ],
})
export class DocsModule {}
