import { InternalServerErrorException, Logger } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateDocDto } from "./dto/create-doc.dto";
import { Doc } from './doc.entity';
import { GetDocsFilterDto } from "./dto/get-docs-filter.dto";
import { DocPrivate } from "./doc-private.enum";

@EntityRepository(Doc)
export class DocRepository extends Repository<Doc> {
  private logger = new Logger('DocRepository');

  async getDocs(
    filterDto: GetDocsFilterDto,
    user: User,
  ): Promise<Doc[]> {
    const { private: privateFilter, search } = filterDto;
    const query = this.createQueryBuilder('doc');

    query.where('doc.userId = :userId', { userId: user.id });

    if (privateFilter) {
      query.andWhere('doc.private = :privateFilter', { privateFilter });
    }

    if (search) {
      query.andWhere('(doc.title LIKE :search OR doc.content LIKE :search)', { search: `%${search}%` });
    }

    try {
      const docs = await query.getMany();

      return docs;
    } catch (error) {
      this.logger.error(`Failed to get docs for user "${user.username}", Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createDoc(
    createDocDto: CreateDocDto,
    user: User
  ): Promise<Doc> {
    const { title, content } = createDocDto;

    const doc = new Doc();
    doc.title = title;
    doc.content = content;
    doc.private = DocPrivate.TRUE;
    doc.user = user;

    try {
      await doc.save();
    } catch (error) {
      this.logger.error(`Failed to create doc for user "${user.username}", Filters: ${JSON.stringify(createDocDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
    
    delete doc.user;
    return doc;
  }
}