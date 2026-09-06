export class RefreshTokenEntity {
    constructor(
        public readonly id: string,
        public readonly token: string,
        public readonly userId: string,
        public readonly expiresAt: Date,
    ) {}

    public isExpired(): boolean {
        return this.expiresAt < new Date();
    }
}