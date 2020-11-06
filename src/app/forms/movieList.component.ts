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
    }

    public movieList: SearchNS.MovieList[] = [];
    public movie: MovieNS.Movie = new MovieNS.Movie;
    public params: SearchNS.Params = new SearchNS.Params();

    public currentPage1 = 1
    ngOnInit(): void {
        this.data.loadMovies()
            .subscribe(success => {
                if (success) {
                    this.movieList = this.data.movieList;
                }
            })
    };

    counter(i: number) {
        return new Array(i);
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
}