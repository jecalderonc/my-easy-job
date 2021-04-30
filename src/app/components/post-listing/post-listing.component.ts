import {Component, OnInit} from '@angular/core';
import {MyEasyJobSvcService} from '../../services/my-easy-job-svc.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PostView} from '../../interfaces/postView';
import {Category} from 'src/app/interfaces/category';
import {City} from 'src/app/interfaces/city';

@Component({
    selector: 'app-post-listing',
    templateUrl: './post-listing.component.html',
    styleUrls: ['./post-listing.component.css']
})
export class PostListingComponent implements OnInit {

    /**
     * Initial params for the component
     */
    city = '';
    category = '';
    postsViews: PostView[] = [];
    manuallyAddedCity = false;
    manuallyAddedCategory = false;

    /**
     * Fields to configure the pagination of the posts.
     */
    page = 1;
    itemsPage = 10;

    /**
     * Principal Search bar objects
     */
    searchForm: FormGroup;
    categories: Category[] = [];
    cities: City[] = [];

    /**
     * Filter Lists Objects
     */
    filterForm: FormGroup;
    filterCategories: Category[] = [];
    filterCities: City[] = [];
    checkedFilterCities: Array<string> = new Array<string>();
    checkedFilterCategories: Array<string> = new Array<string>();

    /**
     * Order Objects
     */
    orderOption: number;
    orderPostsField = '';
    orderPostsDirection = '';

    constructor(private myEasyJobSvc: MyEasyJobSvcService, private formBuilder: FormBuilder, private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {

        // Set the params to load the posts according to the categories and cities selected in the home page.
        this.activatedRoute.queryParams
            .subscribe(params => {
                    console.log(params);
                    if (params.city) {
                        this.city = params.city;
                    }
                    if (params.category) {
                        this.category = params.category;
                    }
                }
            );

        this.searchForm = this.formBuilder.group({
            category: [null],
            city: [null]
        });

        this.filterForm = this.formBuilder.group({
            categoryCheck: [null],
            cityCheck: [null]
        });

        // Get the categories and cities in order to load the drop down lists.
        this.myEasyJobSvc.getCategories().subscribe(categories => {
            this.categories = categories;
        });

        this.myEasyJobSvc.getCities().subscribe(cities => {
            this.cities = cities;
        });

        // Load the cities and categories filters of the left side and check the options currently selected,
        // in this case the params received.
        this.getCitiesAndCategoriesAndCheckedFilters();

        // Get and load the post list according to the filters.
        this.getPosts(this.city.toString(), this.category.toString());

        // Update the list of checked cities and categories.
        this.updateCheckedFilters();
    }

    /**
     * Get and load the categories and cities that have at least one post associated to them,
     * the method also check as selected the selected in the filters.
     */
    getCitiesAndCategoriesAndCheckedFilters(): void {
        this.getCategoriesAndCheckedFilters();
        this.getCitiesAndCheckedFilters();
    }

    /**
     * Get and load the categories that have at least one post associated to them,
     * the method also check as selected the selected in the filters.
     */
    getCategoriesAndCheckedFilters(): void {
        this.myEasyJobSvc.getCategoriesWithPost().subscribe(categories => {
            const index = categories.map(function(e) {
                return e.idCategory;
            }).indexOf(Number(this.category));
            if (index > -1) {
                const cat = categories[index];
                cat.selected = true;
                categories[index] = cat;
            } else if (this.category !== '') {
                const addIndex = this.categories.map(function(e) {
                    return e.idCategory;
                }).indexOf(Number(this.category));
                if (addIndex > -1) {
                    const addCat: Category = this.categories[addIndex];
                    addCat.selected = true;
                    categories.push(addCat);
                    this.manuallyAddedCategory = true;
                }
            }
            this.filterCategories = categories;
        });
    }

    /**
     * Get and load the cities that have at least one post associated to them,
     * the method also check as selected the selected in the filters.
     */
    getCitiesAndCheckedFilters(): void {
        this.myEasyJobSvc.getCitiesWithPost().subscribe(cities => {
            const index = cities.map(function(e) {
                return e.idCity;
            }).indexOf(Number(this.city));
            if (index > -1) {
                const cit = cities[index];
                cit.selected = true;
                cities[index] = cit;
            } else if (this.city !== '')  {
                const addIndex = this.cities.map(function(e) {
                    return e.idCity;
                }).indexOf(Number(this.city));
                if (addIndex > -1) {
                    const addCit: City = this.cities[addIndex];
                    addCit.selected = true;
                    cities.push(addCit);
                    this.manuallyAddedCity = true;
                }
            }
            this.filterCities = cities;
        });
    }

    /**
     * Get the posts associated to the cities and categories selected,
     * more than one city or category can be send joined with ;
     * it could be using the search form or the filters in the left side of the page.
     *
     * @param cityParam list of cities.
     * @param categoryParam list of categories.
     */
    getPosts(cityParam: string, categoryParam: string): void {
        this.myEasyJobSvc.getPostByCityListAndCategoryList(cityParam, categoryParam)
            .subscribe((res: any) => {
                console.log(res);
                this.postsViews = res;
            }, (err: any) => {
                console.log(err);
            });
    }

    /**
     * Update the filters of the left side according to the search params.
     */
    updateCheckedFilters(): void {
        if (this.city) {
            this.checkedFilterCities.push(this.city);
        }
        if (this.category) {
            this.checkedFilterCategories.push(this.category);
        }
    }

    /**
     * Submit method of the top search form.
     */
    onSearchFormSubmit(): void {
        let citySelected = '';
        let categorySelected = '';

        // set the value of the city only if this is selected.
        if (this.searchForm.value.city != null) {
            citySelected = this.searchForm.value.city.toString();
        }

        // set the value of the category only if this is selected.
        if (this.searchForm.value.category != null) {
            categorySelected = this.searchForm.value.category.toString();
        }

        // Set the fields according to the last search and reload the components.
        this.city = citySelected;
        this.category = categorySelected;
        this.getCitiesAndCategoriesAndCheckedFilters();
        this.getPosts(citySelected, categorySelected);
        this.updateCheckedFilters();
    }

    /**
     * Event when one city is selected in the left side component of filters.
     *
     * @param e event
     */
    onCityFilterCheckClick(e): void {
        const index = this.checkedFilterCities.indexOf(e.target.value, 0);
        if (e.target.checked) {
            if (!(index > -1)) {
                this.checkedFilterCities.push(e.target.value);
            }
        } else {
            if (index > -1) {
                this.checkedFilterCities.splice(index, 1);
                if (this.manuallyAddedCity && (e.target.value == this.city)){
                    this.city = '';
                    const removeIndex = this.filterCities.map(function(e) {
                        return e.idCity;
                    }).indexOf(Number(e.target.value));
                    this.filterCities.splice(removeIndex, 1);
                }
            }
        }

        // Join the list of categories and cities using a ;, reload the post list.
        this.joinAndLoadFilters();
    }

    /**
     * Event when one category is selected in the left side component of filters.
     *
     * @param e event
     */
    onCategoryFilterCheckClick(e): void {
        const index = this.checkedFilterCategories.indexOf(e.target.value, 0);
        if (e.target.checked) {
            if (!(index > -1)) {
                this.checkedFilterCategories.push(e.target.value);
            }
        } else {
            if (index > -1) {
                this.checkedFilterCategories.splice(index, 1);
                if (this.manuallyAddedCategory && (e.target.value == this.category)){
                    this.category = '';
                    const removeIndex = this.filterCategories.map(function(e) {
                        return e.idCategory;
                    }).indexOf(Number(e.target.value));
                    this.filterCategories.splice(removeIndex, 1);
                }
            }
        }
        // Join the list of categories and cities using a ;, reload the post list.
        this.joinAndLoadFilters();
    }

    /**
     * Join the list of categories and cities using a ;, reload the post list.
     */
    joinAndLoadFilters(): void {
        const cities = this.checkedFilterCities.join(';');
        const categories = this.checkedFilterCategories.join(';');
        this.getPosts(cities, categories);
    }

    /**
     * Order the posts according tho the option selected.
     * @param value Number of the option selected.
     */
    onOrderSelect(value: number): void {
        if (value == 1) {
            this.orderPostsField = 'date';
            this.orderPostsDirection = 'desc';
        } else if (value == 2) {
            this.orderPostsField = 'date';
            this.orderPostsDirection = 'asc';
        } else if (value == 3) {
            this.orderPostsField = 'score';
            this.orderPostsDirection = 'desc';
        } else if (value == 4) {
            this.orderPostsField = 'score';
            this.orderPostsDirection = 'asc';
        }
    }
}
