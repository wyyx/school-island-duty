import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { tap } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('AuthGuard')
    return this.authService.isBinding$.pipe(
      tap(isBinding => {
        if (!isBinding) {
          this.router.navigateByUrl('/check-device')
        }
      })
    )

    // return true
  }
}
