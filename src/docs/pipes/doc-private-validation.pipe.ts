import { BadRequestException, PipeTransform } from '@nestjs/common';
import DOC_PRIVATE from '../constants/private';

export class DocPrivateValidationPipe implements PipeTransform {
  readonly allowedValues = DOC_PRIVATE;

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isPrivateParamValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid value`);
    }

    return value;
  }

  private isPrivateParamValid(privateParam: any) {
    const idx = this.allowedValues.indexOf(privateParam);
    
    return idx !== -1;
  }
}