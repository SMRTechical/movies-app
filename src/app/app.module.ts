import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from "@angular/router";
import { OmdbService } from './services/omdbService';
import { AppComponent } from './app.component';

import { SelectedMovie } from './forms/selectedMovie.component';
import { MovieList } from './forms/movieList.component';

import { About } from './forms/about.component';

import { Contact } from './forms/contact.component';

let routes = [
  { path: "", component: MovieList },
  { path: "selected", component: SelectedMovie },
  { path: "about", component: About },
  { path: "contact", component: Contact }

];
@NgModule({
  declarations: [
    AppComponent,
    MovieList,
    SelectedMovie,
    About,
    Contact
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false //for debugging of routes
  })
  ],
  providers: [
    OmdbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
