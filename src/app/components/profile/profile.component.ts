import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MyEasyJobSvcService} from '../../services/my-easy-job-svc.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserView} from '../../interfaces/userView';
import {CurrentUserServiceService} from '../../services/current-user-service.service';
import {AppUser} from '../../interfaces/appUser';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    /**
     * Fields to load the component
     */
    idUser: number = 0;
    profileView: UserView;

    /**
     * Fields to set and load the scores of the user that creates the post.
     */
    scores: number[];
    negativeScores: number[];

    /**
     * Fields to configure the pagination of the posts.
     */
    page: number = 1;
    itemsPage: number = 10;

    /**
     * Fields to Rate the User.
     */
    public stars: boolean[] = Array(5).fill(false);
    addComment: FormGroup;
    isValidUser = false;
    appUser: AppUser = null;

    constructor(private myEasyJobSvc: MyEasyJobSvcService, private formBuilder: FormBuilder, private router: Router,
                private activatedRoute: ActivatedRoute, private currentUserServiceService: CurrentUserServiceService) {
    }

    ngOnInit(): void {

        // Set the params to load the page.
        if (this.activatedRoute.snapshot.paramMap.get('idProfile')) {
            this.idUser = +this.activatedRoute.snapshot.paramMap.get('idProfile');
        }

        // Get the current logged user to validate if this can rate the user.
        this.currentUserServiceService.getCurrentUser()
            .subscribe(
                user => {
                    if (user != null) {
                        this.isValidUser = (user.idAppUser != this.idUser);
                        this.appUser = user;
                    }
                }
            );

        this.addComment = this.formBuilder.group({
            comment: [null, Validators.required],
            idUser: [this.idUser, Validators.required],
            idQualifierUser: [(this.appUser != null) ? this.appUser.idAppUser : null, Validators.required],
            score: [null, Validators.required],
            date: [this.getDate(), Validators.required]
        });

        // If the idUser exists the page load the details of it.
        if (this.idUser > 0) {
            this.myEasyJobSvc.getUserViewByUser(this.idUser)
                .subscribe((res: any) => {
                    console.log(res);
                    this.profileView = res;
                    this.createArrayRating(this.profileView.ratingView.score);
                }, (err: any) => {
                    console.log(err);
                });
        }

    }

    /**
     * Create the arrays to load the stars according to the score of the user.
     *
     * @param score Score of the user.
     */
    createArrayRating(score: number): void {
        score = Math.trunc(score);
        this.scores = Array(score).fill(0).map((x, i) => i);
        this.negativeScores = Array(5 - score).fill(0).map((x, i) => i);
    }

    /**
     * Method that manage the event when the user rate the user, get and set the stars.
     *
     * @param rating number of the rate.
     */
    public rate(rating: number): void {
        this.stars = this.stars.map((_, i) => rating > i);
        this.addComment.controls['score'].setValue(rating);
    }

    /**
     * Return the current date to set the date value of the form.
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
     * Submit of the new rating of the user, call the service and save the new rating object.
     */
    onFormAddCommentSubmit(): void {
        this.myEasyJobSvc.saveRating(this.addComment.value)
            .subscribe((res: any) => {
                console.log(res);
                this.hideModel();
                Swal.fire(
                    'Guardado',
                    'La calificación ha sido guardada correctamente',
                    'success');
                this.reloadComponent();
            }, (err: any) => {
                console.log(err);
            });
    }

    /**
     * When a new rating is saved the app redirect to the same page in order to reload all the componentes.
     */
    reloadComponent(): void {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/profile', this.idUser]);
    }

    /**
     * Close the modal of rate the user in order to reload the page correctly.
     * @private
     */
    @ViewChild('closeModalButton') private closeModalButton: ElementRef;

    hideModel() {
        this.closeModalButton.nativeElement.click();
    }
}
