import {Component, OnInit} from '@angular/core';
import {PostView} from '../../interfaces/postView';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MyEasyJobSvcService} from '../../services/my-easy-job-svc.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../interfaces/category';
import {City} from '../../interfaces/city';
import Swal from 'sweetalert2';
import {CurrentUserServiceService} from '../../services/current-user-service.service';

@Component({
    selector: 'app-edit-post',
    templateUrl: './edit-post.component.html',
    styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

    // constants
    private namePostParameter = 'post';
    private nameFilesParameter = 'files';

    // Fields to initialize the component
    idPost: number = null;
    idUser: number = null;
    post: PostView;
    postForm: FormGroup;
    categories: Category[] = [];
    cities: City[] = [];

    // Image Fields to upload
    userFile1;
    imgURL1: any;
    loadedImage1;

    userFile2;
    imgURL2: any;
    loadedImage2;

    userFile3;
    imgURL3: any;
    loadedImage3;

    userFile4;
    imgURL4: any;
    loadedImage4;


    constructor(private myEasyJobSvc: MyEasyJobSvcService, private formBuilder: FormBuilder, private router: Router,
                private activatedRoute: ActivatedRoute, private currentUserServiceService: CurrentUserServiceService) {
    }

    ngOnInit(): void {

        this.postForm = this.formBuilder.group({
            idCategory: [null, Validators.required],
            idCity: [null, Validators.required],
            title: [null, Validators.required],
            description: [null, Validators.required],
            date: [this.getDate()],
            idPost: [null],
            idUser: [this.idUser]
        });

        // Set the query params
        if (this.activatedRoute.snapshot.paramMap.get('idPost')) {
            this.idPost = +this.activatedRoute.snapshot.paramMap.get('idPost');
        }
        if (this.activatedRoute.snapshot.paramMap.get('idUser')) {
            this.idUser = +this.activatedRoute.snapshot.paramMap.get('idUser');
        }

        // Load the categories of the dropdown lists
        this.myEasyJobSvc.getCategories().subscribe(categories => {
            this.categories = categories;
        });
        this.myEasyJobSvc.getCities().subscribe(cities => {
            this.cities = cities;
        });

        // Validate if the param idPost was sent, this conditional validate if the form is to create a new post
        // or edit an existing post.
        if (this.idPost > 0) {
            this.myEasyJobSvc.getPostEditMode(this.idPost)
                .subscribe((res: any) => {
                    console.log(res);
                    this.post = res;
                    this.validateCorrectUserPost();
                    this.initializeEditMode();
                }, (err: any) => {
                    console.log(err);
                });
        } else {
            this.initializeCreateMode();
        }
    }

    /**
     * Validate if the user is the owner of the post associated to the id.
     */
    validateCorrectUserPost(): void {
        this.idUser = this.getCurrentUser();
        if (this.post.idUser !== this.idUser) {
            this.router.navigate(['my-posts'])
                .then(_ => console.log('User not authorized to edit this post.'));
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
     * Initialize the component in edit mode.
     */
    initializeEditMode(): void {
        this.postForm = this.formBuilder.group({
            idCategory: [this.post.idCategory, Validators.required],
            idCity: [this.post.idCity, Validators.required],
            title: [this.post.title, Validators.required],
            description: [this.post.description, Validators.required],
            idPost: [this.post.idPost],
            date: [this.post.date],
            idUser: [this.post.idUser]
        });
        this.loadImagesEditMode();
    }

    /**
     * If the component is in edit mode this method load the current images of it.
     * We only can have 4 images.
     */
    loadImagesEditMode(): void {

        if (this.post.postImageList) {
            this.post.postImageList.forEach(
                postImage => {
                    switch (postImage.priority) {
                        case 1: {
                            this.loadedImage1 = postImage.image;
                            break;
                        }
                        case 2: {
                            this.loadedImage2 = postImage.image;
                            break;
                        }
                        case 3: {
                            this.loadedImage3 = postImage.image;
                            break;
                        }
                        case 4: {
                            this.loadedImage4 = postImage.image;
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
            );
        }

    }

    /**
     * Initialize the component in create mode, all the fields are empty.
     */
    initializeCreateMode(): void {
        this.postForm = this.formBuilder.group({
            idCategory: [null, Validators.required],
            idCity: [null, Validators.required],
            title: [null, Validators.required],
            description: [null, Validators.required],
            date: [this.getDate()],
            idPost: [null],
            idUser: [this.idUser]
        });
    }

    /**
     * Submit the form, this call the service to save the post.
     */
    onFormSubmit(): void {
        // We send a formData object because we upload images and the Post Object in the same request.
        const formData = new FormData();

        // Append the Post object and the images selected in the form.
        formData.append(this.namePostParameter, JSON.stringify(this.postForm.value));
        if (this.userFile1) {
            formData.append(this.nameFilesParameter, this.userFile1, '1');
        }
        if (this.userFile2) {
            formData.append(this.nameFilesParameter, this.userFile2, '2');
        }
        if (this.userFile3) {
            formData.append(this.nameFilesParameter, this.userFile3, '3');
        }
        if (this.userFile4) {
            formData.append(this.nameFilesParameter, this.userFile4, '4');
        }

        // Call the service and save the post.
        this.myEasyJobSvc.savePost(formData)
            .subscribe((res: any) => {
                Swal.fire(
                    'Guardado',
                    'El post ha sido guardado correctamente',
                    'success');
                if (this.idPost != null) {
                    this.router.navigate(['/post-details', this.idPost]).then(_ => console.log('Post Saved!'));
                } else {
                    this.router.navigate(['/my-posts']).then(_ => console.log('Post Saved!'));
                }
            }, (err: any) => {
                console.log(err);
            });
    }

    /**
     * Retun the current date in order to fill the date field of the object.
     */
    getDate(): string {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const todayString = yyyy + '-' + mm + '-' + dd;
        return todayString;
    }

    /**
     * Load the image and show it in the form after the selection.
     *
     * @param e event.
     * @param n Numeric value that identify the image selected in the form,
     */
    onSelectFile(e, n): void {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            switch (n) {
                case 1: {
                    this.userFile1 = file;
                    reader.readAsDataURL(file);
                    reader.onload = (_e) => {
                        this.imgURL1 = reader.result;
                    };
                    break;
                }
                case 2: {
                    this.userFile2 = file;
                    reader.readAsDataURL(file);
                    reader.onload = (_e) => {
                        this.imgURL2 = reader.result;
                    };
                    break;
                }
                case 3: {
                    this.userFile3 = file;
                    reader.readAsDataURL(file);
                    reader.onload = (_e) => {
                        this.imgURL3 = reader.result;
                    };
                    break;
                }
                case 4: {
                    this.userFile4 = file;
                    reader.readAsDataURL(file);
                    reader.onload = (_e) => {
                        this.imgURL4 = reader.result;
                    };
                    break;
                }
                default: {
                    break;
                }
            }
            const mimeType = e.target.files[0].type;

            if (mimeType.match(/image\/*/) == null) {
                // Show error.
                return;
            }
        }
    }
}
