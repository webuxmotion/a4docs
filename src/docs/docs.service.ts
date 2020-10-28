import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { DocPrivate } from './doc-private.enum';
import { Doc } from './doc.entity';
import { DocRepository } from './doc.repository';
import { CreateDocDto } from './dto/create-doc.dto';
import { GetDocsFilterDto } from './dto/get-docs-filter.dto';

@Injectable()
export class DocsService {
  constructor(
    @InjectRepository(DocRepository)
    private docRepository: DocRepository,
  ) {}

  async createDoc(
    createDocDto: CreateDocDto,
    user: User,
  ): Promise<Doc> {
    return this.docRepository.createDoc(createDocDto, user);
  }

  getDocs(
    filterDto: GetDocsFilterDto,
    user: User,
  ) {
    return this.docRepository.getDocs(filterDto, user);
  }

  async getDocById(
    id: number,
    user: User
  ): Promise<Doc> {
    const found = await this.docRepository.findOne({ where: { id, userId: user.id }});

    if (!found) {
      throw new NotFoundException(`Doc with ID "${id}" not found`);
    }

    return found;
  }

  async updateDocPrivate(
    id: number,
    privateParam: DocPrivate,
    user: User,
  ): Promise<Doc> {
    const doc = await this.getDocById(id, user);
    doc.private = privateParam;
    await doc.save();

    return doc;
  }

  async deleteDoc(
    id: number,
    user: User,
  ): Promise<void> {
    const result = await this.docRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Doc with ID "${id}" not found. There is nothing to delete`);
    }
  }
}
