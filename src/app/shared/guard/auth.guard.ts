import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';


@Injectable()
export class AuthGuard implements CanActivate {
  user
  constructor(private auth: AuthService, private router: Router) {
    this.getUser()
   }
  /*  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (localStorage.getItem('isLoggedin')) {
          console.log("you have permission")
          return true;
      }
  
      this.router.navigate(['/login']);
      console.log("you don't have permission")
      return false;
  }*/
  getUser():void {
    this.auth.user.subscribe(user =>{this.user=user})
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log("bypassing authgard")
    console.log(state.url)
    if (state.url == "/login") {
      if (this.auth.user)
      {
        console.log(this.auth.user
          .take(1)
          .map(user => !!user)
          .do(loggedIn => {
            if (!loggedIn) {
              console.log('access denied')
            }
            return true
          })
  )
      }
      return true

    }
    else {
      return this.auth.user
        .take(1)
        .map(user => !!user)
        .do(loggedIn => {
          if (!loggedIn) {
            console.log('access denied')
            this.router.navigate(['/login']);
          }
        })
    }
  }

}
