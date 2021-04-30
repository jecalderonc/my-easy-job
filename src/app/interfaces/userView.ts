import {RatingView} from './ratingView';
import {Rating} from './rating';

export interface UserView {
    idAppUser: number;
    name: string;
    email: string;
    description: string;
    phone: string;
    image: string;
    ratingView: RatingView;
    ratingList: Rating[];
}
