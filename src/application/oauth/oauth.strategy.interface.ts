import { OauthValidateResult } from './beans/oauth-validate-result.dto';

export abstract class OauthStrategyI<TOauthStrategyProfile> {
  abstract validate(
    accessToken: string,
    refreshToken: string | undefined,
    profile: TOauthStrategyProfile | undefined,
    done: (
      err: Error | undefined | null,
      user: OauthValidateResult | undefined,
      info?: object,
    ) => void,
  ): void;
}
