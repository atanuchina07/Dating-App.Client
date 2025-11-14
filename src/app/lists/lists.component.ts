import { Component, inject, OnInit } from '@angular/core';
import { LikesServiceService } from '../_services/likes-service.service';
import { Member } from '../_models/member';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  imports: [ButtonsModule, FormsModule, MemberCardComponent,PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit {
  likesService = inject(LikesServiceService);
  predicate: string = 'liked';
  pageNumber = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.loadLikes();
  }

  getLike() {
    switch (this.predicate) {
      case 'liked':
        return 'Members you like';
      case 'likedBy':
        return 'Members who like you';
      default:
        return 'Mutual like';
    }
  }
  loadLikes() {
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize);
  }
  pageChanged(event: any)
  {
    if (this.pageNumber !== event.pageNumber)
    {
      this.pageNumber = event.pageNumber;
      this.loadLikes();
    }
  }
}
