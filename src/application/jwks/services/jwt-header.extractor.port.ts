import { Extractor } from '../../common/extractor';

export abstract class JwtHeaderExtractorPort extends Extractor<
  {
    kid: string | undefined;
    alg: string | undefined;
  },
  { token: string }
> {}
