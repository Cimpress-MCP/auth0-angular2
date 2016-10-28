import { Injectable, Provider } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

const delayMilliseconds = 500; // Delay half of a second
// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  // Configure Auth0
  lock = new Auth0Lock(this.clientId, this.domain, {
    closable: false // Users are required to log in
  });

  constructor(private clientId: string, private domain: string) {
    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
    });
  }

  authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  };

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  };

  logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
  };

  loginIfNotAuthenticated(){
    if(this.authenticated()) return;
    this.login();
  }

  // Delay validating the authentication status a little bit to avoid race conditions when redirecting to the same page after user is logged in
  delayedLoginIfNotAuthenticated() {
    setTimeout(() => {
      this.loginIfNotAuthenticated();
    }, delayMilliseconds);
  };

  logoutAndRelogin() {
    this.logout();
    this.login();
  }
}

export function provideAuthService(clientId: string, domain: string): Provider {
  return {
    provide: AuthService,
    useValue: new AuthService(clientId, domain)
  };
}
