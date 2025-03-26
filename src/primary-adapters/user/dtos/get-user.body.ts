import { IsNumber } from 'class-validator';

export class GetUserBody {
  @IsNumber()
  page = 1;

  @IsNumber()
  limit = 10;
}
