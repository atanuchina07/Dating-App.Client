import { User } from './user';
//this class is used for initialize all user parameters
export class UserParams {
  gender: string;
  minAge = 18;
  maxAge = 100;
  pageNumber = 1;
  pageSize = 6;
  orderBy = 'lastActive';
  constructor(user: User | null) {
    this.gender = user?.gender === 'female' ? 'male' : 'female'; //this for if logedin user male then only showwing all male matching
  }
}
