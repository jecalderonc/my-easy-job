import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Category} from 'src/app/interfaces/category';
import {MyEasyJobSvcService} from 'src/app/services/my-easy-job-svc.service';
import {City} from '../../interfaces/city';
import {Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    searchForm: FormGroup;
    categories: Category[] = [];
    cities: City[] = [];

    constructor(private myEasyJobSvc: MyEasyJobSvcService, private formBuilder: FormBuilder, private router: Router) {
        // If the app is redirected to this component, this will reload all the internal components.
        this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
        };
    }

    ngOnInit(): void {
        this.searchForm = this.formBuilder.group({
            category: [null],
            city: [null]
        });

        // Load all the categories and cities to show the dropdown list of this options to make a new search.
        this.myEasyJobSvc.getCategories().subscribe(categories => {
            this.categories = categories;
        });

        this.myEasyJobSvc.getCities().subscribe(cities => {
            this.cities = cities;
        });
    }

    /**
     * The app redirects to the post-listing page and filter the search to show the post according to the options selected.
     */
    onFormSubmit(): void {
        this.router.navigate(['/post-listing'], {
            queryParams: {
                city: this.searchForm.value.city,
                category: this.searchForm.value.category
            }
        });
    }

}
