import {Injectable, Input} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {throwError} from 'rxjs';
import {TokenService} from './services/token.service';
import {catchError, map} from 'rxjs/operators';
import {AuthService} from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private tokenService: TokenService,
        private authService: AuthService,
        private route: ActivatedRoute) {
    }

    /**
     * Interceptor to validate the request and responses of the service calls.
     *
     * @param request request.
     * @param next handler.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): any {

        const token = this.tokenService.getToken();
        const refreshToken = this.tokenService.getRefreshToken();

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
        }

        request = request.clone({
            headers: request.headers.set('Accept', 'application/json')
        });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log(error.error.error);
                if (error.status === 401) {
                    this.router.navigate(['login'], {
                        queryParams: {
                            redirectURL: this.router.routerState.snapshot.url
                        }
                    }).then(_ => console.log('redirect to login'));
                } else if (error.status === 404){
                    this.router.navigate(['resource-not-found'])
                        .then(_ => console.log('redirect to not found page'));
                } else if (error.status === 500){
                    this.router.navigate(['error-page'])
                        .then(_ => console.log('redirect to login'));
                }
                return throwError(error);
            }));
    }
}
