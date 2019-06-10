import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isBindingSubject$ = new BehaviorSubject<boolean>(false)
  isBinding$ = this.isBindingSubject$.asObservable()

  constructor() {}
}
