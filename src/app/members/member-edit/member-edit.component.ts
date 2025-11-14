import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../_models/member';
import { FormsModule, NgForm } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';

@Component({
  selector: 'app-member-edit',
  imports: [FormsModule, TabsModule, PhotoEditorComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css',
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', { static: false }) editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) message($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member?: Member;
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  private toaster = inject(ToastrService);
  ngOnInit(): void {
    this.loadmembers();
  }
  loadmembers() {
    const user = this.accountService.currentUser();
    if (!user) return;
    this.memberService.getMember(user.username).subscribe({
      next: (member) => {
        this.member = member;
      },
    });
  }
  //This is for post the form data
  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      ///editForm is use other than member after submit member will update but changes is not saved instantly
      next: () => {
        this.toaster.success('Updated Successfully');
        this.editForm?.reset(this.member);
      },
    });
    console.log(this.member);
  }
  OnMemberChange(event: Member) {
    this.member = event;
  }
}
