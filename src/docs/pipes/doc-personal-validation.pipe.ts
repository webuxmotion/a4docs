import { BadRequestException, PipeTransform } from '@nestjs/common';
import DOC_PERSONAL from '../constants/personal';

export class DocPersonalValidationPipe implements PipeTransform {
  readonly allowedValues = DOC_PERSONAL;

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isPersonalValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid value`);
    }

    return value;
  }

  private isPersonalValid(personal: any) {
    const idx = this.allowedValues.indexOf(personal);
    
    return idx !== -1;
  }
}