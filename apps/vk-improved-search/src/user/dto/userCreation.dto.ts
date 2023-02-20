import { UserCreationAttributes } from '@common-types/models';
import { passwordRegEx } from '@common-types/consts';
import {
  IsDefined,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto implements UserCreationAttributes {
  @IsDefined()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsDefined()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(passwordRegEx, { message: 'Password is too simple' })
  password: string;
}
