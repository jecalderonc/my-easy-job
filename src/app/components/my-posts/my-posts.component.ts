import {Component, OnInit} from '@angular/core';
import {PostView} from '../../interfaces/postView';
import {MyEasyJobSvcService} from '../../services/my-easy-job-svc.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentUserServiceService} from '../../services/current-user-service.service';

@Component({
    selector: 'app-my-posts',
    templateUrl: './my-posts.component.html',
    styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {

    /**
     * Fields to configure the pagination of the posts.
     */
    page = 1;
    itemsPage = 10;

    /**
     * Fields to initialize the component.
     */
    postsViews: PostView[] = [];
    idUser: number;

    constructor(private myEasyJobSvc: MyEasyJobSvcService, private router: Router,
                private activatedRoute: ActivatedRoute, private currentUserServiceService: CurrentUserServiceService) {
    }

    ngOnInit(): void {
        // Set the params to load correctly the component.
        this.idUser = this.getCurrentUser();
        if (this.idUser !== 0) {
            this.getPosts(this.idUser);
        }
    }

    /**
     * Get the current logged user.
     */
    getCurrentUser(): number {
        let currentUser = 0;
        this.currentUserServiceService.getCurrentUser()
            .subscribe(
                user => {
                    if (user != null) {
                        currentUser = user.idAppUser;
                    }
                }
            );
        if (currentUser === 0) {
            this.router.navigate(['home'])
                .then(_ => console.log('User not logged.'));
        }
        return currentUser;
    }

    /**
     * Call the service and load the post associated to the user.
     *
     * @param idUser Id of the user.
     */
    getPosts(idUser: number): void {
        this.myEasyJobSvc.getPostByUser(idUser)
            .subscribe((res: any) => {
                console.log(res);
                this.postsViews = res;
            }, (err: any) => {
                console.log(err);
            });
    }

}
