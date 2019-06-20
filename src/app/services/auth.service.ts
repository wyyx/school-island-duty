import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { dbService } from '../storage/db.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isBindingSubject$ = new BehaviorSubject<boolean>(false)
  isBinding$ = this.isBindingSubject$.asObservable()

  constructor() {}
}
