import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MyEasyJobSvcService} from '../../services/my-easy-job-svc.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {

    /**
     * Input params received to load the component.
     */
    @Input() title: string;
    @Input() ratingScore: number;
    @Input() ratingQuantity: string;
    @Input() user: string;
    @Input() date: string;
    @Input() city: string;
    @Input() category: string;
    @Input() idPost: number;
    @Input() postImage: string;

    /**
     * Fields to set and load the scores of the user that creates the post.
     */
    scores: number[];
    negativeScores: number[];

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        this.createArrayRating(this.ratingScore);
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
