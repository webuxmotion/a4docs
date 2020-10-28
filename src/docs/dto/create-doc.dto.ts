import { IsNotEmpty } from "class-validator";

export class CreateDocDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}