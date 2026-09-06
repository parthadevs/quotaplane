export class UserEntity {
  constructor(
      public readonly id: string,
      public readonly email: string,
      public readonly passwordHash: string,
      public readonly firstName: string | null,
      public readonly lastName: string | null,
      public readonly createdAt: Date,
      public readonly updatedAt: Date,
      private _isEmailVerified: boolean,
  ) {}

  public get isEmailVerified(): boolean {
      return this._isEmailVerified;
  }

  public verifyEmail(): void {
      if (this._isEmailVerified) {
          throw new Error("Email is already verified.");
      }
      this._isEmailVerified = true;
  }
}