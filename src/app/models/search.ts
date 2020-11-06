export class SearchResults {
    Search: MovieList[];
    totalResults: string;
    Response: string;
  }
  
  export interface MovieList {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }

  export class Params {
    movieName: string;
    imdbID:string;
}