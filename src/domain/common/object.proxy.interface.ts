import { ProxyI } from './proxy.interface';

export class ObjectProxy<TObject extends object>
  implements ProxyI<keyof TObject, TObject[keyof TObject]>
{
  constructor(private readonly object: TObject) {}

  resolve<TKey extends keyof TObject>(key: TKey): TObject[TKey] | undefined {
    return this.object[key];
  }
}
