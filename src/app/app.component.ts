import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AccountService } from './_services/account.service';
import { HomeComponent } from './home/home.component';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { LikesServiceService } from './_services/likes-service.service';

@Component({
  selector: 'app-root',
  imports: [
    NgFor,
    NavComponent,
    HomeComponent,
    RouterOutlet,
    NgxSpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);
  private likeService = inject(LikesServiceService);

  title = 'Dating App';
  ngOnInit() {
    this.setCurrentUser();
  }
  setCurrentUser() {
    // This is use for refresh
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString); ///parse convert to json string to Object
    this.accountService.currentUser.set(user);
    this.likeService.getLikeIds(); //If I refresh the page data will be not gone.
  }
}
