import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-rating-detail',
    templateUrl: './rating-detail.component.html',
    styleUrls: ['./rating-detail.component.css']
})
export class RatingDetailComponent implements OnInit {

    /**
     * Input params to load the component.
     */
    @Input() userName: string;
    @Input() userId: number;
    @Input() comment: string;
    @Input() score: number;
    @Input() date: string;

    /**
     * Fields to initialize the component.
     */
    scores: number[];
    negativeScores: number[];

    constructor() {
    }

    ngOnInit(): void {
        this.createArrayRating(this.score);
    }

    /**
     * Create the arrays to load the stars according to the score of the user.
     *
     * @param score Score of the user.
     */
    createArrayRating(score: number): void {
        this.scores = Array(score).fill(0).map((x, i) => i);
        this.negativeScores = Array(5 - score).fill(0).map((x, i) => i);
    }
}
