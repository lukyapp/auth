import { Dto } from '../../../domain/common/dto';

export abstract class BodyDto<T extends object> extends Dto<T> {}
