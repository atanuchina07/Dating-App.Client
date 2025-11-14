import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesServiceService } from './likes-service.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private likeService=inject(LikesServiceService)
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null); //signal

  roles = computed(() => {
    const user = this.currentUser();

    if (user && user.token)
    {
      const Allrole = JSON.parse(atob(user.token.split('.')[1])).role;// Took the middle portion of token where role have presented.//atob to decode the token

      return Array.isArray(Allrole) ? Allrole : [Allrole];
    }
    return [];
  })

  login(model: any) {
    //The http.post function returns the user data
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user)); //set the user data in localstorage as a string
          this.currentUser.set(user);
          this.likeService.getLikeIds();//this is for fetching or colecting the like data initialy after login
        }
      })
    );
  }
  register(model: any) {
    //The http.post function returns the user data
    console.log('2nd register');
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user)); //set the user data in localstorage as a string
          this.currentUser.set(user);
          this.likeService.getLikeIds();
        }
        return user;
      })
    );
  }
  logout() {
    localStorage.removeItem('user'); //the user should be same which was setting on localstorage(setItem) ///stringyfy convert to json string
    this.currentUser.set(null);
  }
}
