import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './_guards/auth.guard';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { memberDetailedResolver } from './_resolver/member-detailed.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { adminGuard } from './_guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'members', component: MemberListComponent, canActivate: [authGuard] },
  ///*** Edit should be before the username path otherwise conflict will occurs
  {
    path: 'members/edit',
    component: MemberEditComponent,
    canActivate: [authGuard],
    canDeactivate: [preventUnsavedChangesGuard],
  },
  {
    path: 'members/:username', // ': ' before username is very important
    component: MemberDetailComponent,
    canActivate: [authGuard],
    resolve: { member: memberDetailedResolver }, //adding the route resolver
  },
  { path: 'lists', component: ListsComponent, canActivate: [authGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard] },

  { path: '**', component: HomeComponent },
];
