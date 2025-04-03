export abstract class OauthControllerI {
  constructor() {}

  abstract authorize(...args: any[]): void | Promise<void>;

  abstract callback(...args: any[]): void | Promise<void>;
}
