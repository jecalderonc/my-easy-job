import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {MyEasyJobSvcService} from '../../services/my-easy-job-svc.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    /**
     * Fields to initialize the component.
     */
    registerForm: FormGroup;
    email = '';
    password = '';
    name = '';

    constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder,
                private myEasyJobSvcService: MyEasyJobSvcService) {
    }

    ngOnInit(): void {
        // Load the formGroup and create the validations for the fields, the form validate the email format.
        this.initForm();
    }

    /**
     * Load the formGroup and create the validations for the fields, the form validate the email format.
     */
    initForm(): void {
        this.registerForm = new FormGroup({
            email: new FormControl('', [
                Validators.required,
                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            password: new FormControl('', [
                Validators.required]),
            name: new FormControl('', [
                Validators.required])
        });
    }

    /**
     * Call the sevice and save the new user registered in the app.
     */
    onFormSubmit(): void {
        this.myEasyJobSvcService.isEmailAvailable(this.registerForm.value.email)
            .subscribe((res: any) => {
                if (res) {
                    this.authService.register(this.registerForm.value)
                        .subscribe((result: any) => {
                            Swal.fire(
                                'Guardado',
                                'Usuario registrado correctamente',
                                'success');
                            this.router.navigate(['/login']).then(_ => console.log('You are registered now!'));
                        }, (err: any) => {
                            console.log(err);
                        });
                } else {
                    Swal.fire(
                        'Error',
                        'El correo con el cual se intenta registrar ya esta asociado a una cuenta en la aplicación. Por favor use uno diferente.',
                        'error');
                    this.initForm();
                }
            });
    }
}
