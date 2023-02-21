import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ValidateJwtPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'string' || !value.match(/.+\..+\..+/)) {
      throw new BadRequestException(`Invalid refresh token`);
    }
    return value;
  }
}
