import {Component, OnInit} from '@angular/core';
import {MyEasyJobSvcService} from '../../services/my-easy-job-svc.service';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PostView} from '../../interfaces/postView';

@Component({
    selector: 'app-post-details',
    templateUrl: './post-details.component.html',
    styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

    /**
     * Fields to initialize the component.
     */
    idPost: number = 0;
    postView: PostView;

    /**
     * Fields to set and load the scores of the user that creates the post.
     */
    scores: number[];
    negativeScores: number[];

    /**
     * Field to validate if the post has at least one image, if this does not have the app shows a default image.
     */
    isThereImage = false;

    constructor(private myEasyJobSvc: MyEasyJobSvcService, private formBuilder: FormBuilder, private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        // Set the params to load the component.
        if (this.activatedRoute.snapshot.paramMap.get('idPost')) {
            this.idPost = +this.activatedRoute.snapshot.paramMap.get('idPost');
        }

        // If the idPost exists the component load the details of it.
        if (this.idPost > 0) {
            // Service call to load the post details.
            this.myEasyJobSvc.getPostDetails(this.idPost)
                .subscribe((res: any) => {
                    console.log(res);
                    this.postView = res;
                    this.createArrayRating(this.postView.ratingView.score);
                    // Validation to set the field that shows the default image.
                    if (this.postView.postImageList.length > 0){
                        this.isThereImage = true;
                    }
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
}
