import { Dto } from '../../../domain/common/dto';

export abstract class ResponseDto<T extends object> extends Dto<T> {}
