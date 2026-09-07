export interface ITokenService {
    generateAccessToken(payload: { userId: string; email: string }): Promise<string>;
    generateRefreshToken(payload: { userId: string }): Promise<string>;
    verifyAccessToken(token: string): Promise<any>;
}