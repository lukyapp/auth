export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly hashedPassword?: string,
    private refreshToken?: string | null,
  ) {}

  static create(email: string, hashedPassword: string): User {
    return new User(crypto.randomUUID(), email, hashedPassword);
  }

  setRefreshToken(hashedToken: string): void {
    this.refreshToken = hashedToken;
  }

  removeRefreshToken(): void {
    this.refreshToken = undefined;
  }

  getRefreshToken(): string | undefined | null {
    return this.refreshToken;
  }
}
