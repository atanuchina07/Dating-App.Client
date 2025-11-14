import {
  Component,
  inject,
  input,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-message',
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-message.component.html',
  styleUrl: './member-message.component.css',
})
export class MemberMessageComponent {
  @ViewChild('messageForm') messageForm?: NgForm;

  username = input.required<string>();
  messageService = inject(MessageService);
  messages = input.required<Message[]>();
  messageContent: string = '';
  updateMessage = output<Message>();

  sendMessage() {
    this.messageService
      .sendMessage(this.username(), this.messageContent)
      .subscribe({
        next: (message) => {
          this.updateMessage.emit(message);
          this.messageForm?.reset();
        },
      });
  }
}
