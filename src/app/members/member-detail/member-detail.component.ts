import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
import { MemberMessageComponent } from '../member-message/member-message.component';
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
@Component({
  selector: 'app-member-detail',
  imports: [TabsModule, GalleryModule, MemberMessageComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent; //static true means access the member tabs before the view fully initialize

  images: GalleryItem[] = [];

  private memberService = inject(MembersService);

  private route = inject(ActivatedRoute);

  private messageService = inject(MessageService);

  member: Member = {} as Member; //Type assertion

  activeTab?: TabDirective;

  messages: Message[] = [];

  ngOnInit(): void {
    // this.getMemberDetail();
    this.route.data.subscribe({
      //get the data by router resolver
      next: (data) => {
        this.member = data['member'];
        this.member &&
          this.member?.photos.map((p) => {
            this.images.push(
              new ImageItem({
                src: p.url,
                thumb: p.url,
              })
            );
          });
      },
    });

    this.route.queryParams.subscribe({
      next: (params) => {
        params['tab'] && this.selectTab(params['tab']);
      },
    });
  }

  // getMemberDetail() {
  //   const userName = this.route.snapshot.paramMap.get('username'); //The username should be same the route arry username//You  will get the username from route path
  //   if (!userName) return;
  //   this.memberService.getMember(userName).subscribe({
  //     next: (member) => {
  //       this.member = member;
  //       /// this is use for creating photo gallery
  //       this.images = [
  //         new ImageItem({
  //           src: this.member.photoUrl,
  //           thumb: this.member.photoUrl,
  //         }),
  //       ];

  //       // console.log(this.images);
  //       // console.log(member);
  //       // console.log(member.photos);
  //     },
  //   });
  // }
  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (
      this.activeTab.heading === 'Messages' &&
      this.messages.length === 0 &&
      this.member
    ) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: (m) => (this.messages = m),
      });
    }
  }
  selectTab(heading: string) {
    //To help of this function you can go messages tab directly
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(
        (x) => x.heading === heading
      );
      if (messageTab) {
        messageTab.active = true;
      }
    }
  }

  onUpdateMessages(event: Message)
  {
    this.messages.push(event);
  }
}
