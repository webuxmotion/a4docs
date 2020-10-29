import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { DocPersonal } from './doc-personal.enum';
import { Doc } from './doc.entity';
import { DocsService } from './docs.service';
import { CreateDocDto } from './dto/create-doc.dto';
import { GetDocsFilterDto } from './dto/get-docs-filter.dto';
import { DocPersonalValidationPipe } from './pipes/doc-personal-validation.pipe';

@Controller('docs')
@UseGuards(AuthGuard())
export class DocsController {
  private logger = new Logger('DocsController');

  constructor(private docsService: DocsService) {}

  @Get()
  getDocs(
    @Query(ValidationPipe) filterDto: GetDocsFilterDto,
    @GetUser() user: User,
  ): Promise<Doc[]> {
    this.logger.verbose(`User "${user.username}" retrieving all docs. Filters: ${JSON.stringify(filterDto)}`);

    return this.docsService.getDocs(filterDto, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createDoc(
    @Body() createDocDto: CreateDocDto,
    @GetUser() user: User
  ): Promise<Doc> {
    this.logger.verbose(`User "${user.username}" creating a new doc. Data: ${JSON.stringify(createDocDto)}`);

    return this.docsService.createDoc(createDocDto, user);
  }

  @Patch('/:id/personal')
  updateDocPersonal(
    @Param('id', ParseIntPipe) id: number,
    @Body('personal', DocPersonalValidationPipe) personal: DocPersonal,
    @GetUser() user: User,
  ): Promise<Doc> {
    return this.docsService.updateDocPersonal(id, personal, user);
  }

  @Delete('/:id')
  deleteDoc(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.docsService.deleteDoc(id, user);
  }

  @Get('/:id')
  getDocById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Doc> {
    return this.docsService.getDocById(id, user);
  }
}
