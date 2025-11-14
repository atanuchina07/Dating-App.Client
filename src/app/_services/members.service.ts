import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { Photo } from '../_models/photo';
import { tap } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/UserParams';
import { getPaginationHeader, setPaginationResponse } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null); ///This signal is used for to avoid loading which page is already visited(Member List Page)

  getMembers(userParams: UserParams) {
    let params = getPaginationHeader(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    return this.http
      .get<Member[]>(this.baseUrl + 'users', { observe: 'response', params })
      .subscribe({
        next: (response) => {
          setPaginationResponse(response, this.paginatedResult);
        },
      });
  }

  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member);
  }

  updateMainPhoto(photo: Photo) {
    return this.http
      .put(this.baseUrl + 'users/set-main-photo/' + photo.id, {})
      .pipe
      // tap(() => {
      //   ///This for also update the matches or members signal
      //   this.members.update((members) =>
      //     members.map((m) => {
      //       if (m.photos.includes(photo)) {
      //         m.photoUrl = photo.url;
      //       }
      //       return m;
      //     })
      //   );
      // })
      ();
  }

  deletePhoto(photo: Photo) {
    return this.http
      .delete(this.baseUrl + 'users/delete-photo/' + photo.id)
      .pipe
      // tap(() => {
      //   this.members.update(
      //     (
      //       ms //Also Update the members signal
      //     ) =>
      //       ms.map((m) => {
      //         if (m.photos.includes(photo)) {
      //           m.photos = m.photos.filter((p) => p.id !== photo.id);
      //         }
      //         return m;
      //       })
      //   );
      // })
      ();
  }
}
