import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { getPaginationHeader, setPaginationResponse } from './paginationHelper';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeader(pageNumber, pageSize);
    params = params.append('container', container);

    return this.http
      .get<Message[]>(`${this.baseUrl}message`, {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) =>
          setPaginationResponse(response, this.paginatedResult),
      });
  }
  getMessageThread(username: string) {
    return this.http.get<Message[]>(
      this.baseUrl + `message/thread/${username}`
    );
  }

  //this function return the Message details
  sendMessage(Username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'message', {
      RecipientUsername: Username,
      Content: content,
    });
  }
  deleteMessage(id: number)
  {
    return this.http.delete(this.baseUrl + 'message/' + id);
  }
}
