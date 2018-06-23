import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from "../../../shared";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isNavbarCollapsed = true;
  user: any;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }
  getUser() {
    this.auth.user.subscribe(user => {
      this.user = user;
      console.log(user)
    }
    )
  }

}
