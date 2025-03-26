import { Expose } from 'class-transformer';
import { AuthenticateUserResponseData } from '../../../application/auth/dtos/authenticate-user.response';
import { Nested } from '../../common/validators/nested.validator';
import { ResponseGetOne } from '../../common/dtos/response-get-one.dto';

export class AuthenticateUserResponse extends ResponseGetOne<AuthenticateUserResponseData> {
  @Expose()
  @Nested(() => AuthenticateUserResponseData)
  declare data: AuthenticateUserResponseData;
}
