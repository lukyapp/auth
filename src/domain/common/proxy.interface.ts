export abstract class ProxyI<TKey, TValue> {
  abstract resolve(key: TKey): TValue | undefined;
}
