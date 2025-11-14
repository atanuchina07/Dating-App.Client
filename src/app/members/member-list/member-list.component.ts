import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../_services/account.service';
import { UserParams } from '../../_models/UserParams';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons'; //This is for sorting button

@Component({
  selector: 'app-member-list',
  imports: [MemberCardComponent, PaginationModule, FormsModule,ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
  memberService = inject(MembersService);
  accountService = inject(AccountService);
  userparams = new UserParams(this.accountService.currentUser());

  //this array of object list use for creating the gender option in form
  genderList: any = [
    {
      value: 'male',
      display: 'Males',
    },
    {
      value: 'female',
      display: 'Females',
    },
  ];
  ngOnInit(): void {
    if (!this.memberService.paginatedResult()) {
      ///if member list not visited then execute this code
      this.loadMembers();
    }
  }
  loadMembers() {
    console.log(this.userparams.gender);
    this.memberService.getMembers(this.userparams);
  }
  pagedChanged(event: any) {
    if (this.userparams.pageNumber !== event.page) {
      this.userparams.pageNumber = event.page;
      this.loadMembers();
    }
  }
  resetFilters() {
    this.userparams = new UserParams(this.accountService.currentUser());
    this.loadMembers();
  }
}
