import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Message } from '../_models/message';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-messages',
  imports: [
    ButtonsModule,
    FormsModule,
    RouterLink,
    PaginationModule,
    TimeagoModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  messageService = inject(MessageService);
  container: string = 'Inbox';
  pageNumber: number = 1;
  pageSize: number = 10;
  isOutBox = this.container === 'OutBox';
  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(
      this.pageNumber,
      this.pageSize,
      this.container
    );
    console.log(this.messageService.paginatedResult()?.items);
  }
  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
  getRoute(message: Message) {
    if (this.container === 'Outbox')
      return `/members/${message.recipientUsername}`;
    else return `/members/${message.senderUsername}`;
  }
  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: (_) => {
        this.messageService.paginatedResult.update((prev) => {
          if (prev && prev.items) {
            const index = prev.items.findIndex((m) => m.id === id);
            if (index > -1) {
              prev.items.splice(index, 1); // remove 1 item at the found index
            }
            return { ...prev, items: [...prev.items] }; // ensure immutability if needed
            // // keep all existing keys/values like pagination, etc.
            // only update the 'items' array with a new reference
          }
          return prev;
        });
      },
    });
  }
}
