export interface RefreshTokenPayload {
    userId: string;
    exp?: number;
}

export interface ITokenService {
    generateAccessToken(payload: { userId: string; email: string }): Promise<string>;
    generateRefreshToken(payload: { userId: string }): Promise<string>;
    verifyAccessToken(token: string): Promise<any>;
    verifyRefreshToken(token: string): Promise<RefreshTokenPayload>;
    hashRefreshToken(token: string): string;
    getRefreshTokenExpiration(token: string): Date;
}
