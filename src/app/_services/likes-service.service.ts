import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { getPaginationHeader, setPaginationResponse } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class LikesServiceService {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  likeIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  //this function use for post or add the data to database
  toggleLike(targetId: number) {
    return this.http.post(`${this.baseUrl}likes/${targetId}`, {});
  }
  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeader(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return this.http
      .get<Member[]>(`${this.baseUrl}likes?`, { observe: 'response', params })
      .subscribe({
        next: (response) =>
          setPaginationResponse(response, this.paginatedResult),
      });
  }
  //return the targetIds list
  getLikeIds() {
    return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
      next: (ids) => this.likeIds.set(ids),
    });
  }
}
//for post request you need to pass any object as a parameter
