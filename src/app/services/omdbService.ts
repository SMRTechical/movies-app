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
    public selectedParams: SearchNS.Params = new SearchNS.Params();
    public searchResults: SearchNS.SearchResults = new SearchNS.SearchResults();
    public movieList: SearchNS.MovieList[] = [];
    public movie: MovieNS.Movie = new MovieNS.Movie();
    public error: string = "";
    public totalPages: number = 0;
    public totalPageSets: number = 0;
    public currentPageSet: number = 0;
    public currentPage: number = 0;
    public currentPageSetMinPage: number = 0;
    public currentPageSetMaxPage: number = 0;
    public startFrom: number = 1;
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
        this.selectedParams = params;
        return this.http.get(this.api + "&s=" + this.selectedParams.movieName)
            .pipe(
                map((data: any) => {
                    return this.apiResponse(data);
                })
            )
    }

    pagingOmdb(params: SearchNS.Params, page: number): Observable<boolean> {
        this.loading = true;
        this.selectedParams = params;
        return this.http.get(this.api + "&s=" + this.selectedParams.movieName + "&page=" + page)
            .pipe(
                map((data: any) => {
                    this.currentPage = page;
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

    getTotalPages(totalItems: number): number {
        var items: number;
        items = Math.ceil(Number(totalItems) / 10);
        return items
    }
    getTotalPageSets(): number {
        var items: number;
        items = Math.ceil(Number(this.totalPages) / 10);
        return items
    }

    getPagesPerPage(): number {
        return this.totalPages / this.totalPageSets
    }

    getPages(): number[] {
        return [...Array(this.getPagesPerPage()).keys()];
    }

    getPagesStartingFrom(): number[] {
        let pages = [...Array(this.getPagesPerPage()).keys()].map(i => i + this.startFrom);
        this.currentPageSetMinPage = Math.min(...pages);
        this.currentPageSetMaxPage = Math.max(...pages);
        return pages;
    }

    getNextPageSet() {
        if (this.currentPageSet < this.totalPageSets) {
            this.currentPageSet++
        }
        this.startFrom = this.currentPageSetMaxPage + 1;
    }

    getPreviousPageSet() {
        if (this.currentPageSet > 1) {
            this.currentPageSet--
        }
        this.startFrom = this.currentPageSetMinPage - 10;
    }

    isLastPageSet(): boolean {
        return this.currentPageSet == this.totalPageSets
    }

    isFirstPageSet(): boolean {
        return this.currentPageSet == 1;
    }

    apiResponse(data: any) {
        this.loading = false;
        if (data.Response == "True") {
            this.error = "";
            this.movieList = data.Search;
            this.totalPages = this.getTotalPages(Number(data.totalResults));
            if (this.totalPages > 0) {
                if (this.currentPage == 0) this.currentPage++;
                this.totalPageSets = this.getTotalPageSets();
                if (this.totalPageSets > 0 && this.currentPageSet == 0) {
                    this.currentPageSet = 1
                }
            }
        }
        else {
            this.error = data.Error
        }
        return true;
    }
}