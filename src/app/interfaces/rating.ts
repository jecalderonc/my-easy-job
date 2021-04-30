import {RatingUserView} from './ratingUserView';

export interface Rating {
    idRating: number;
    score: number;
    comment: string;
    idUser: number;
    idQualifierUser: number;
    qualifierRatingUserView: RatingUserView;
    date: string;
}
