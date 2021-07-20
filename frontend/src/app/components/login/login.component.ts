import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
// @ts-ignore
import * as OktaSignIn from '@okta/okta-signin-widget';
import shopAppConfig from '../../config/shop-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuthService) {
    this.oktaSignin = new OktaSignIn({
      features: {
        registration: true,
      },
      baseUrl: shopAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: shopAppConfig.oidc.clientId,
      redirectUri: shopAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: shopAppConfig.oidc.issuer,
        scopes: shopAppConfig.oidc.scopes,
      },
    });
  }

  ngOnInit(): void {
    this.oktaSignin.remove();
    this.oktaSignin.renderEl(
      {
        el: '#okta-sign-in-widget',
      },
      (response: any) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuthService.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }
}
