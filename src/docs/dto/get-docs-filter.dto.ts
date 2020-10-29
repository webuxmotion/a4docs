import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { DocPersonal } from "../doc-personal.enum";
import DOC_PERSONAL from '../constants/personal';

export class GetDocsFilterDto {
  @IsOptional()
  @IsIn(DOC_PERSONAL)
  personal: DocPersonal;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}