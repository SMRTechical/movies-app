import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
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
    }

    public movie: MovieNS.Movie = new MovieNS.Movie;
    ngOnInit(): void {
        if (!this.movie || !this.movie.Title) {
            this.router.navigate([""]);
        }
    };
    onHome() {
        this.router.navigate([""]);
    }
}