import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Category} from '../interfaces/category';
import {City} from '../interfaces/city';
import {PostView} from '../interfaces/postView';
import {Observable} from 'rxjs';
import {Rating} from '../interfaces/rating';
import {UserView} from '../interfaces/userView';

@Injectable({
    providedIn: 'root'
})
export class MyEasyJobSvcService {

    constructor(private http: HttpClient) {
    }

    /**
     * Retrieve all the categories.
     */
    getCategories(): Observable<any> {
        return this.http.get<Category[]>(`${environment.MY_EASY_JOB_URL}categories`);
    }

    /**
     * Retrieve all the cities.
     */
    getCities(): Observable<any> {
        return this.http.get<City[]>(`${environment.MY_EASY_JOB_URL}cities`);
    }

    /**
     * Retrieve the list of categories that have associated at least one post.
     */
    getCategoriesWithPost(): Observable<any> {
        return this.http.get<Category[]>(`${environment.MY_EASY_JOB_URL}categories/active`);
    }

    /**
     * Retrieve the list of cities that have associated at least one post.
     */
    getCitiesWithPost(): Observable<any> {
        return this.http.get<City[]>(`${environment.MY_EASY_JOB_URL}cities/active`);
    }

    /**
     * Retrieve the list of post according to the cityId and categoryId parameters.
     *
     * @param city id of the city
     * @param category id of the category
     */
    getPostByCityAndCategory(city: number, category: number): Observable<any> {
        let params = new HttpParams();
        params = params.append('city', city.toString());
        params = params.append('category', category.toString());

        return this.http.get<PostView[]>(`${environment.MY_EASY_JOB_URL}post/getpostbyparams`, {params});
    }

    /**
     * Retrieve the list of post that are related to one of the categories or cities sent as parameters.
     *
     * @param city list of cities
     * @param category list of categories
     */
    getPostByCityListAndCategoryList(city: string, category: string): Observable<any> {
        let params = new HttpParams();
        params = params.append('idsCity', city);
        params = params.append('idsCategory', category);

        return this.http.get<PostView[]>(`${environment.MY_EASY_JOB_URL}post/getpostbylistparams`, {params});
    }

    /**
     * Retrieve the lost of post created by the user.
     *
     * @param user Id of the user.
     */
    getPostByUser(user: number): Observable<any> {
        return this.http.get<PostView[]>(`${environment.MY_EASY_JOB_URL}account/post/user/${user}`);
    }

    /**
     * Retrieve all the information of the post using the id of the post.
     *
     * @param post Id of the post
     */
    getPostEditMode(post: number): Observable<any> {
        return this.http.get<PostView>(`${environment.MY_EASY_JOB_URL}account/post/${post}`);
    }

    /**
     * Retrieve the basic information of the post using the id sent as parameter.
     *
     * @param post Id of the post.
     */
    getPost(post: number): Observable<any> {
        return this.http.get<PostView>(`${environment.MY_EASY_JOB_URL}post/${post}`);
    }

    /**
     * Retrieve the details of the post using the id sent as parameter.
     *
     * @param post Id of the post.
     */
    getPostDetails(post: number): Observable<any> {
        return this.http.get<PostView>(`${environment.MY_EASY_JOB_URL}post/${post}/details`);
    }

    /**
     * Save the post information, the method also saves the images associated to the post, these images are received as
     * multipart object.
     *
     * @param formData Files and Post Data in a form Data object.
     */
    savePost(formData: FormData): Observable<any> {
        return this.http.post<any>(`${environment.MY_EASY_JOB_URL}account/post`, formData);
    }

    /**
     * Delete the post associated to the id sent, this method also deletes the images asociated to the post.
     *
     * @param post Id of the post.
     */
    deletePost(post: number): Observable<any> {
        return this.http.delete<any>(`${environment.MY_EASY_JOB_URL}account/post/${post}`);
    }

    /**
     * Retrieve the list of ranting of the user using the id sent as parameter.
     *
     * @param user Id of the user.
     */
    getRatingByUser(user: number): Observable<any> {
        return this.http.get<Rating[]>(`${environment.MY_EASY_JOB_URL}rating/getratingbyuser/${user}`);
    }

    /**
     * Save the rating sent as parameter.
     *
     * @param rating Rating object.
     */
    saveRating(rating: Rating): Observable<any> {
        return this.http.post<any>(`${environment.MY_EASY_JOB_URL}account/rating`, rating);
    }

    /**
     * Retrieve the basic information of the user using the id received as parameter.
     *
     * @param user Id of the user.
     */
    getUserViewByUser(user: number): Observable<any> {
        return this.http.get<UserView>(`${environment.MY_EASY_JOB_URL}user/${user}`);
    }

    /**
     * Retrieve the user information of the user using the id sent as parameter.
     *
     * @param user id of the user.
     */
    getUserByUser(user: number): Observable<any> {
        return this.http.get<UserView>(`${environment.MY_EASY_JOB_URL}account/user/${user}`);
    }

    /**
     * Update the user information.
     */
    saveUser(formData: FormData): Observable<any> {
        return this.http.post<any>(`${environment.MY_EASY_JOB_URL}account/user`, formData);
    }

    /**
     * Retrieve the basic information of the user using the id sent as parameter.
     *
     * @param email Email of the user.
     */
    getUserByEmail(email: string): Observable<any> {
        return this.http.get<UserView>(`${environment.MY_EASY_JOB_URL}account/user/${email}/basicinfo`);
    }

    /**
     * Validate if the email is available to register a new user.
     *
     * @param email Email of the user.
     */
    isEmailAvailable(email: string): Observable<any> {
        let params = new HttpParams();
        params = params.append('email', email);
        return this.http.get<boolean>(`${environment.MY_EASY_JOB_URL}user/email/isavaliable`, {params});
    }
}
