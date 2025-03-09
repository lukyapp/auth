export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    private password: string,
    private refreshToken?: string,
  ) {}

  static create(
    email: string,
    firstName: string,
    lastName: string,
    hashedPassword: string,
  ): User {
    return new User(email, firstName, lastName, hashedPassword);
  }

  setRefreshToken(hashedToken: string): void {
    this.refreshToken = hashedToken;
  }

  removeRefreshToken(): void {
    this.refreshToken = undefined;
  }

  getPassword(): string {
    return this.password;
  }

  getRefreshToken(): string | undefined {
    return this.refreshToken;
  }
}
