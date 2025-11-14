import { Component} from '@angular/core';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-home',
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  registerModel = true;
  registerToggle() {
    this.registerModel = !this.registerModel;
  }
  CancleRegisterModel(event: boolean) {
    //// This function is use for registration cancelation And Child to parent communication
    this.registerModel = event;
    console.log('cancle');

  }
}
