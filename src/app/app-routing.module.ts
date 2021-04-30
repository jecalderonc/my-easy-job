import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {AuthGuard} from './auth.guard';
import {PostListingComponent} from './components/post-listing/post-listing.component';
import {PostDetailsComponent} from './components/post-details/post-details.component';
import {ProfileComponent} from './components/profile/profile.component';
import {EditProfileComponent} from './components/edit-profile/edit-profile.component';
import {EditPostComponent} from './components/edit-post/edit-post.component';
import {MyPostsComponent} from './components/my-posts/my-posts.component';
import {ErrorPageComponent} from './components/error-page/error-page.component';

const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'post-listing', component: PostListingComponent},
    {path: 'post-details/:idPost', component: PostDetailsComponent},
    {path: 'profile/:idProfile', component: ProfileComponent},
    {path: 'edit-profile', canActivate: [AuthGuard], component: EditProfileComponent},
    {path: 'edit-post/:idPost', canActivate: [AuthGuard], component: EditPostComponent},
    {path: 'create-post/:idUser', canActivate: [AuthGuard], component: EditPostComponent},
    {path: 'my-posts', canActivate: [AuthGuard], component: MyPostsComponent},
    {path: 'resource-not-found', component: NotFoundComponent},
    {path: 'error-page', component: ErrorPageComponent},
    {path: '**', redirectTo: 'resource-not-found'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
