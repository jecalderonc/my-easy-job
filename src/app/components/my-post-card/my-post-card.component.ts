import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MyEasyJobSvcService} from '../../services/my-easy-job-svc.service';
import Swal from 'sweetalert2';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-my-post-card',
    templateUrl: './my-post-card.component.html',
    styleUrls: ['./my-post-card.component.css']
})
export class MyPostCardComponent implements OnInit {

    /**
     * Input params received to load the component.
     */
    @Input() title: string;
    @Input() date: string;
    @Input() idPost: number;
    @Input() idUser: number;
    @Input() postImage: string;

    constructor(private router: Router, private myEasyJobSvc: MyEasyJobSvcService) {
    }

    ngOnInit(): void {
    }

    /**
     * remove the current post.
     */
    removePost(): void {
        this.confirmationDelete();
    }

    /**
     * Validate if the user is sure to remove the post, show the messages to confirm the deleting.
     */
    confirmationDelete(): void {
        Swal.fire({
            title: 'Esta seguro de eliminar el Post?',
            text: 'No será posible deshacer esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminarla.',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.deletePost();
                Swal.fire(
                    'Eliminado',
                    'El post ha sido eliminado.',
                    'success'
                );
            }
        });
    }

    /**
     * call the service to delete the post.
     */
    deletePost(): void {
        this.myEasyJobSvc.deletePost(this.idPost).subscribe((res: any) => {
            console.log(res);
            this.reloadMyPosts();
        }, (err: any) => {
            console.log(err);
        });
    }

    /**
     * redirect to the same page in order to load all the posts again.
     */
    reloadMyPosts(): void {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/my-posts']);
    }
}
