import { PartialType } from '@nestjs/mapped-types';
import { CreateWorksapaceDto } from './create-worksapace.dto';

export class UpdateWorksapaceDto extends PartialType(CreateWorksapaceDto) {}
