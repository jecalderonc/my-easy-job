import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AppUser} from '../interfaces/appUser';

const LOGGED_USER = 'logged_user';

@Injectable({
    providedIn: 'root'
})
export class CurrentUserServiceService {
    /**
     * Subject to observe the current logged user changes.
     */
    userValue = new BehaviorSubject<AppUser>(null);

    constructor() {
    }

    /**
     * Set the user after loggin in the app.
     *
     * @param appUser User data.
     */
    setCurrentUser(appUser: AppUser): void {
        if (appUser == null) {
            localStorage.removeItem(LOGGED_USER);
        } else {
            const userString = appUser.idAppUser + '|' + appUser.name;
            localStorage.setItem(LOGGED_USER, userString);
        }
        this.userValue.next(appUser);
    }

    /**
     * Return the current logged user in the app.
     */
    getCurrentUser(): Observable<AppUser> {
        // get the user info from the local storage.
        const user = localStorage.getItem(LOGGED_USER);
        // update the observable object in order to advice the components the change.
        if (user) {
            const attributes = user.split('|', 2);
            const appUser = {} as AppUser;
            appUser.idAppUser = Number(attributes[0]);
            appUser.name = attributes[1];
            this.setCurrentUser(appUser);
        }
        return this.userValue.asObservable();
    }

}
