import { Component, inject, input, Input, OnInit, output } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../_models/member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';
import { Photo } from '../../_models/photo';

@Component({
  selector: 'app-photo-editor',
  imports: [NgIf, NgFor, NgClass, NgStyle, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css',
})
export class PhotoEditorComponent implements OnInit {
  ngOnInit(): void {
    this.initializeUploader();
  }
  member = input.required<Member>();
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  memberChange = output<Member>();
  
  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      const updatedMember = { ...this.member() }; //To coppy the member datatype.
      updatedMember.photoUrl = photo.url;
      updatedMember.photos.forEach((p) => {
        if (p.isMain) p.isMain = false;
        if (p.id == photo.id) p.isMain = true;
      });
      updatedMember.photos.push(photo); // Upadated the photo
      this.memberChange.emit(updatedMember); //Sent the update on parent componet to update member signal
    };
  }
  setMainPhoto(photo: Photo) {
    this.memberService.updateMainPhoto(photo).subscribe({
      next: (_) => {
        const user = this.accountService.currentUser();
        if (user) {
          user.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(user)); //For updation you need to update local storage also then you set the current user
          console.log(this.accountService.currentUser());
        }
        const updatedMember = { ...this.member() };
        updatedMember.photoUrl = photo.url;
        updatedMember.photos.forEach((p) => {
          if (p.isMain) p.isMain = false;
          if (p.id == photo.id) p.isMain = true;
        });
        this.memberChange.emit(updatedMember); //It will also update the memberChange or parent component
      },
    });
  }
  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo).subscribe({
      next: (_) => {
        const updateManager = { ...this.member() };
        updateManager.photos = updateManager.photos.filter(
          (p) => p.id !== photo.id
        );
        this.memberChange.emit(updateManager);
        console.log('Photo Deleted');
      },
    });
  }
}
