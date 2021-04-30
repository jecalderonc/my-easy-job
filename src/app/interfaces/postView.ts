import {Category} from './category';
import {City} from './city';
import {RatingView} from './ratingView';
import {UserView} from './userView';
import {PostImage} from './postImage';

export interface PostView {
    idPost: number;
    idUser: number;
    idCategory: number;
    idCity: number;
    title: string;
    description: string;
    date: string;
    locationLatitude: string;
    locationLongitude: string;
    city: City;
    category: Category;
    ratingView: RatingView;
    userView: UserView;
    mainPostImage: PostImage;
    postImageList: PostImage[];
}
