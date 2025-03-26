export abstract class Extractor<TResult, TParams = void> {
  abstract extractFrom(params: TParams): TResult;
}
