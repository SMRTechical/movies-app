import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import * as SearchNS from '../models/search';
import * as MovieNS from "../models/movie";
import { OmdbService } from '../services/omdbService';
@Component({
    selector: "selected-movie",
    templateUrl: "selectedMovie.component.html",
    styleUrls: ["selectedMovie.component.css"]
})
export class SelectedMovie implements OnInit {
    constructor(private data: OmdbService, public router: Router) {
        this.movie = data.movie;
            this.movieList = data.movieList;
            //this.params = data.selectedParams;
        
    }

    public movieList: SearchNS.MovieList[] = [];
    public params: SearchNS.Params = new SearchNS.Params();


    public movie: MovieNS.Movie = new MovieNS.Movie;
    ngOnInit(): void {
        if (!this.movie || !this.movie.Title) {
            this.router.navigate([""]);
        }
        // else {
        //     this.data.loadMovies()
        //         .subscribe(success => {
        //             if (success) {
        //                 this.movieList = this.data.movieList;
        //             }
        //         })
        // }
    };
    onHome() {
        this.router.navigate([""]);
    }

    onBack(){
        this.router.navigate([""]);
    }

    getMovies(start:number, end:number){
        //console.log('moview',this.movie)
        //console.log('movies', this.movieList)
        //var movies = this.movieList;
       var movies = this.movieList.filter(m=>m.imdbID != this.movie.imdbID);
        movies = movies.slice(start,end);
        return movies;
    }

    onClick(movie: SearchNS.MovieList) {
        this.params.imdbID = movie.imdbID;
        this.data.getMovie(this.params)
            .subscribe(success => {
                if (success) {
                   // this.router.navigate(["selected"]);
                   this.movie = this.data.movie;
                }
            })
    }
}