import {Injectable} from '@angular/core';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    constructor() {
    }

    /**
     * Return the token of the logged user.
     */
    getToken(): string {
        return localStorage.getItem(ACCESS_TOKEN);
    }

    /**
     * Return the refresh token of the logged user.
     */
    getRefreshToken(): string {
        return localStorage.getItem(REFRESH_TOKEN);
    }

    /**
     * Persist the token of the logged user in the local storage.
     *
     * @param token Token.
     */
    saveToken(token): void {
        localStorage.setItem(ACCESS_TOKEN, token);
    }

    /**
     * Persist the refresh token of the logged user in the local storage.
     *
     * @param token Refresh Token.
     */
    saveRefreshToken(refreshToken): void {
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
    }

    /**
     * Remove the token of the logged user.
     */
    removeToken(): void {
        localStorage.removeItem(ACCESS_TOKEN);
    }

    /**
     * Remove the refresh token of the logged user.
     */
    removeRefreshToken(): void {
        localStorage.removeItem(REFRESH_TOKEN);
    }
}
