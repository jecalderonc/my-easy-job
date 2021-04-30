import {Component, OnInit} from '@angular/core';
import {UserView} from '../../interfaces/userView';
import {MyEasyJobSvcService} from '../../services/my-easy-job-svc.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {CurrentUserServiceService} from '../../services/current-user-service.service';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
    // constants
    private nameAppUserParameter = 'appUser';
    private nameFileParameter = 'file';

    // Fields to initialize the component
    idUser = 0;
    user: UserView;
    profileForm: FormGroup;

    // File upload fields
    imgURL: any;
    public imagePath;
    userFile;
    loadedImage;

    constructor(private myEasyJobSvc: MyEasyJobSvcService, private formBuilder: FormBuilder, private router: Router,
                private activatedRoute: ActivatedRoute, private currentUserServiceService: CurrentUserServiceService) {
    }

    ngOnInit(): void {

        this.profileForm = this.formBuilder.group({
            idAppUser: [null],
            name: [null, Validators.required],
            description: [null, Validators.required],
            email: [null, Validators.required],
            phone: [null, Validators.required]
        });

        this.idUser = this.getCurrentUser();
        // If the idUser field is correct ehe page load the information od the user.
        if (this.idUser > 0) {
            this.myEasyJobSvc.getUserViewByUser(this.idUser)
                .subscribe((res: any) => {
                    console.log(res);
                    this.user = res;
                    this.loadedImage = res.image;
                    this.initializeEditMode();
                }, (err: any) => {
                    console.log(err);
                });
        }
    }

    /**
     * Get the current logged user.
     */
    getCurrentUser(): number {
        let currentUser = 0;
        this.currentUserServiceService.getCurrentUser()
            .subscribe(
                user => {
                    if (user != null) {
                        currentUser = user.idAppUser;
                    }
                }
            );

        if (currentUser === 0) {
            this.router.navigate(['home'])
                .then(_ => console.log('User not logged.'));
        }
        return currentUser;
    }

    /**
     * Initialize the component in edit mode, load all the fields.
     */
    initializeEditMode(): void {
        this.profileForm = this.formBuilder.group({
            idAppUser: [this.user.idAppUser, Validators.required],
            name: [this.user.name, Validators.required],
            description: [this.user.description, Validators.required],
            email: [this.user.email, Validators.required],
            phone: [this.user.phone, Validators.required]
        });
    }

    /**
     * Save the profile of the user.
     */
    onFormSubmit(): void {
        // We send a formData object because we upload the profile image and the user Object in the same request.
        const formData = new FormData();

        // Append the User object and the image selected in the form.
        formData.append(this.nameAppUserParameter, JSON.stringify(this.profileForm.value));
        formData.append(this.nameFileParameter, this.userFile);

        // Call the service and save the profile.
        this.myEasyJobSvc.saveUser(formData)
            .subscribe((res: any) => {
                Swal.fire(
                    'Guardado',
                    'El perfil ha sido guardado correctamente',
                    'success');
                this.router.navigate(['/profile', this.user.idAppUser]).then(_ => console.log('Profile Saved!'));
            }, (err: any) => {
                console.log(err);
            });
    }

    /**
     * Load the image and show it in the form after the selection.
     *
     * @param e event
     */
    onSelectFile(e): void {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            this.userFile = file;

            const mimeType = e.target.files[0].type;
            if (mimeType.match(/image\/*/) == null) {
                // Show error
                return;
            }

            const reader = new FileReader();

            this.imagePath = file;
            reader.readAsDataURL(file);
            reader.onload = (_e) => {
                this.imgURL = reader.result;
            };
        }
    }
}
