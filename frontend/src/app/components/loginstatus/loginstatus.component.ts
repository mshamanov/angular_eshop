import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-loginstatus',
  templateUrl: './loginstatus.component.html',
  styleUrls: ['./loginstatus.component.css'],
})
export class LoginstatusComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private oktaAuthService: OktaAuthService) {}

  ngOnInit(): void {
    this.oktaAuthService.$authenticationState.subscribe((result) => {
      this.isAuthenticated = result;
      this.getUserDetails();
    });
  }

  public getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuthService.getUser().then((result) => {
        if (result) {
          const name = JSON.stringify(result.name);
          const email = JSON.stringify(result.email);
          sessionStorage.setItem("userName", name);
          sessionStorage.setItem("userEmail", email);
        }
      });
    }
  }

  public logout() {
    this.oktaAuthService.signOut();
  }
}
