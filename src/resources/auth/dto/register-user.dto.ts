import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@resources/user/dto';

export class RegisterUserDto extends OmitType(CreateUserDto, ['roleName']) {}
