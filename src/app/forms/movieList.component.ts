import { Component, OnInit } from "@angular/core";

import { Router } from '@angular/router';
import * as MovieNS from "../models/movie";
import * as SearchNS from '../models/search';
import { OmdbService } from '../services/omdbService';
@Component({
    selector: "movie-list",
    templateUrl: "movieList.component.html",
    styleUrls: ["movieList.component.css"]
})
export class MovieList implements OnInit {
    constructor(public data: OmdbService, public router: Router) {
        this.movieList = data.movieList;
        this.params = data.selectedParams;
    }

    public movieList: SearchNS.MovieList[] = [];
    public movie: MovieNS.Movie = new MovieNS.Movie;
    public params: SearchNS.Params = new SearchNS.Params();

    ngOnInit(): void {
        if (this.params.movieName == undefined) {
            this.data.loadMovies()
                .subscribe(success => {
                    if (success) {
                        this.movieList = this.data.movieList;
                    }
                })
        }
        else {
            this.onSearch();
        }
    };

    getPages(currentPageSet: number) {
        return this.data.getPagesStartingFrom();
    }

    onSearch() {
        this.data.searchOmdb(this.params)
            .subscribe(success => {
                if (success) {
                    this.movieList = this.data.movieList;
                }
            })
    }

    onPageChange(page: number) {
        this.data.pagingOmdb(this.params, page)
            .subscribe(success => {
                if (success) {
                    this.movieList = this.data.movieList;
                }
            })
    }

    onClick(movie: SearchNS.MovieList) {
        this.params.imdbID = movie.imdbID;
        this.data.getMovie(this.params)
            .subscribe(success => {
                if (success) {
                    this.router.navigate(["selected"]);
                }
            })
    }

    isPageActive(page: number) {
        return { 'page-item': true, 'active': this.data.currentPage == page }
    }

    isNextDisabled() {
        return { 'page-item': true, 'disabled': this.data.isLastPageSet() };
    }

    isPreviousDisabled() {
        return { 'page-item': true, 'disabled': this.data.isFirstPageSet() };
    }

    getNext() {
        this.data.getNextPageSet();
        this.onPageChange(this.data.startFrom)
    }

    getPrevious() {
        this.data.getPreviousPageSet();
        this.onPageChange(this.data.startFrom)
    }
}