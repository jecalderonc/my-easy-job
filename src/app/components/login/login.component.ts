import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    // Fields to initialize the component.
    loginForm: FormGroup;
    username = '';
    password = '';
    previousRoute = '';

    constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        // Load the formGruop and create the validations for the fields, the form validate the email format.
        this.loginForm = new FormGroup({
            username: new FormControl('', [
                Validators.required,
                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            password: new FormControl('', [
                Validators.required])
        });

        // Set the query params, the login form redirect to the previous page in case the user has been redirected for expired token.
        this.activatedRoute.queryParams
            .subscribe(params => {
                    console.log(params);
                    if (params.redirectURL) {
                        this.previousRoute = params.redirectURL;
                    }
                }
            );
        this.authService.logout();
    }

    /**
     * The component call the authorization service, if the user is valid this redirect to home or previous page according to the scenario.
     */
    onFormSubmit(): void {
        this.authService.login(this.loginForm.value)
            .subscribe(() => {
                if (this.previousRoute !== '') {
                    this.router.navigate([this.previousRoute])
                        .catch(() => this.router.navigate(['/home']));
                } else {
                    this.router.navigate(['/home']).then(_ => console.log('User logged correctly'));
                }
            }, (err: any) => {
                console.log(err);
            });
    }
}
