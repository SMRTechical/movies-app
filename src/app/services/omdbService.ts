import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import * as MovieNS from "../models/movie";
import * as SearchNS from "../models/search";
@Injectable()
export class OmdbService {
    constructor(private http: HttpClient) {
    }

    public loading: boolean = false;
    public initialising: boolean = false;
    public searchResults: SearchNS.SearchResults = new SearchNS.SearchResults();
    public movieList: SearchNS.MovieList[] = [];
    public movie: MovieNS.Movie = new MovieNS.Movie();
    public error: string = "";
    public totalPages: number = 0;
    public api: string = "http://www.omdbapi.com/?apikey=5e9debf7";

    loadMovies(): Observable<boolean> {
        this.initialising = true;
        return this.http.get(this.api + "&s=action&y=2020&plot=full")
            .pipe(
                map((data: any) => {
                    this.initialising = false;
                    if (data.Response == "True") {
                        this.error = "";
                        this.movieList = data.Search;
                    }
                    else {
                        this.error = data.Error
                    }
                    return true;
                })
            )
    }

    searchOmdb(params: SearchNS.Params): Observable<boolean> {
        this.loading = true;
        return this.http.get(this.api + "&s=" + params.movieName)
            .pipe(
                map((data: any) => {
                    return this.apiResponse(data);
                })
            )
    }

    pagingOmdb(params: SearchNS.Params, page: number): Observable<boolean> {
        this.loading = true;
        return this.http.get(this.api + "&s=" + params.movieName + "&page=" + page)
            .pipe(
                map((data: any) => {
                    return this.apiResponse(data)
                })
            )
    }

    getMovie(params: SearchNS.Params): Observable<boolean> {
        this.loading = true;
        return this.http.get(this.api + "&i=" + params.imdbID)
            .pipe(
                map((data: MovieNS.Movie) => {
                    this.loading = false;
                    this.movie = data;
                    return true;
                })
            )
    }

    getPages(totalItems: number): number {
        var pages: number;
        pages = Math.ceil(Number(totalItems) / 10);
        return pages
    }

    apiResponse(data: any) {
        this.loading = false;
        if (data.Response == "True") {
            this.error = "";
            this.movieList = data.Search;
            this.totalPages = this.getPages(Number(data.totalResults));
        }
        else {
            this.error = data.Error
        }
        return true;
    }
}