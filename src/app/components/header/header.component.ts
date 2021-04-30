import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {CurrentUserServiceService} from '../../services/current-user-service.service';
import {AppUser} from '../../interfaces/appUser';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    /**
     * Fields used to validate and show the info of the logged user in the header.
     */
    loggedUserFlag = false;
    loggedUserName = '';
    loggedUserId = 0;
    appUser: AppUser = null;

    constructor(private authService: AuthService, private router: Router, private currentUserServiceService: CurrentUserServiceService) {
        // Call the service in charge of validate if exists an user logged in the app.
        currentUserServiceService.getCurrentUser()
            .subscribe(
                user => {
                    this.appUser = user;
                    this.loadUser();
                }
            );
    }

    ngOnInit(): void {
    }

    /**
     * Load the current logged user, if this not exists the header shows "iniciar sesion" option.
     */
    loadUser(): void {
        if (this.appUser != null) {
            this.loggedUserFlag = true;
            this.loggedUserName = this.appUser.name;
            this.loggedUserId = this.appUser.idAppUser;
        } else {
            this.loggedUserFlag = false;
            this.loggedUserName = '';
            this.loggedUserId = 0;
        }
    }

    /**
     * Logged out the user using the authService and redirect to the home page of the app.
     */
    logout(): void {
        this.authService.logout();
        this.router.navigate(['/home']).then(_ => console.log('Logout'));
    }
}
