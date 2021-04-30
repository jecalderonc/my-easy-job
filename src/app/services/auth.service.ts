import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {TokenService} from './token.service';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AppUser} from '../interfaces/appUser';
import {MyEasyJobSvcService} from './my-easy-job-svc.service';
import {CurrentUserServiceService} from './current-user-service.service';

const OAUTH_CLIENT = 'MyEasyJob';
const OAUTH_SECRET = 'Secret123';
const DEFAULT_GRANDTYPE = 'password';

/**
 * Configuration of the headers.
 */
const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(OAUTH_CLIENT + ':' + OAUTH_SECRET)
    })
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    redirectUrl = '';

    /**
     * Error handling method.
     *
     * @param error
     * @private
     */
    private static handleError(error: HttpErrorResponse): any {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError(
            'Something bad happened; please try again later.');
    }

    private static log(message: string): any {
        console.log(message);
    }

    constructor(private http: HttpClient, private tokenService: TokenService, private myEasyJobSvc: MyEasyJobSvcService,
                private currentUserServiceService: CurrentUserServiceService) {
    }

    /**
     * Login method, receive de thata of the user and validate if its have the acces.
     *
     * @param loginData
     */
    login(loginData: any): Observable<any> {
        // Remove the current logged user.
        this.tokenService.removeToken();
        this.tokenService.removeRefreshToken();
        const body = new HttpParams()
            .set('username', loginData.username)
            .set('password', loginData.password)
            .set('grant_type', DEFAULT_GRANDTYPE);

        // Call the service to get the token of the user.
        return this.http.post<any>(environment.AUTH_API_URL + 'oauth/token', body, HTTP_OPTIONS)
            .pipe(
                tap(res => {
                    // Save token and refresh token.
                    this.tokenService.saveToken(res.access_token);
                    this.tokenService.saveRefreshToken(res.refresh_token);
                    // Get the user info to load the header correctly.
                    this.myEasyJobSvc.getUserByEmail(loginData.username).subscribe((response: any) => {
                        console.log(res);
                        this.saveLoggedUser(response);
                    });
                }),
                catchError(AuthService.handleError)
            );
    }

    /**
     * Unimplemented method to refresh the token.
     *
     * @param refreshData
     */
    refreshToken(refreshData: any): Observable<any> {
        return null;
    }

    /**
     * Remove the current logged user of the app.
     */
    logout(): void {
        this.tokenService.removeToken();
        this.tokenService.removeRefreshToken();
        this.removeLoggedUser();
    }

    /**
     * Register a new user in the app.
     *
     * @param data user data.
     */
    register(data: any): Observable<any> {
        return this.http.post<any>(environment.AUTH_API_URL + 'my-easy-job/login/signup', data)
            .pipe(
                tap(_ => AuthService.log('register')),
                catchError(AuthService.handleError)
            );
    }

    /**
     * Validate the current token, this mehots is unused at this moment.
     */
    secured(): Observable<any> {
        return this.http.get<any>(environment.AUTH_API_URL + 'secret')
            .pipe(catchError(AuthService.handleError));
    }

    /**
     * When the user is logged the app save its data in order to set the header correctly.
     *
     * @param appUser User data.
     */
    saveLoggedUser(appUser: AppUser): void {
        this.currentUserServiceService.setCurrentUser(appUser);
    }

    /**
     * Remove the current user of the memory in order to update the header.
     */
    removeLoggedUser(): void {
        this.currentUserServiceService.setCurrentUser(null);
    }
}
