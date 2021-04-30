import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './components/home/home.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthInterceptor} from './auth.interceptor';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {PostListingComponent} from './components/post-listing/post-listing.component';
import {PostCardComponent} from './components/post-card/post-card.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {SortPipe} from './pipes/sort.pipe';
import {PostDetailsComponent} from './components/post-details/post-details.component';
import {ProfileComponent} from './components/profile/profile.component';
import {RatingDetailComponent} from './components/rating-detail/rating-detail.component';
import {EditProfileComponent} from './components/edit-profile/edit-profile.component';
import {EditPostComponent} from './components/edit-post/edit-post.component';
import {MyPostsComponent} from './components/my-posts/my-posts.component';
import {MyPostCardComponent} from './components/my-post-card/my-post-card.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    PostListingComponent,
    PostCardComponent,
    SortPipe,
    PostDetailsComponent,
    ProfileComponent,
    RatingDetailComponent,
    EditProfileComponent,
    EditPostComponent,
    MyPostsComponent,
    MyPostCardComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
