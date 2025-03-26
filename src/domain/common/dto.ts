export abstract class Dto<T extends object> {
  constructor(instance: T) {
    Object.assign(this, instance);
  }
}
