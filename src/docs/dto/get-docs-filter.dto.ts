import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { DocPrivate } from "../doc-private.enum";
import DOC_PRIVATE from '../constants/private';

export class GetDocsFilterDto {
  @IsOptional()
  @IsIn(DOC_PRIVATE)
  private: DocPrivate;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}