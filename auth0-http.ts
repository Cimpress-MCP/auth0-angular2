import { Injectable, Provider, OpaqueToken } from '@angular/core';
import { AuthHttp, AuthConfig, tokenNotExpired } from 'angular2-jwt';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class Auth0Http extends AuthHttp {
  private tokenHttp: Http;
  private configuration: Auth0HttpConfig;

  constructor(
    config: Auth0HttpConfig,
    http: Http)
  {
    super(new AuthConfig( {
      tokenGetter: () => this.tokenGetter()
    }), http);
    
    this.tokenHttp = http;
    this.configuration = config;
  }

  private tokenGetter(): Promise<string> {
    return tokenNotExpired(this.configuration.tokenName)
      ? Promise.resolve(localStorage.getItem(this.configuration.tokenName))
      : this.tokenRefresher();
  }

  private tokenRefresher() : Promise<string> {
    return this.tokenHttp.post(`https://${this.configuration.domain}/delegation`, {
      client_id: this.configuration.clientId,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      refresh_token: this.configuration.refreshToken,
      scope: 'scopes' // Some service endpoints may require specific scopes
    }).toPromise()
    .then<string>(res => {
      localStorage.setItem(this.configuration.tokenName, res.json().id_token);
      return res.json().id_token;
    })
    .catch(err => {
      console.error(`Failed to get ${this.configuration.tokenName} from refresh token.`, err);
      return err;
    });
  }
}

export class Auth0HttpConfig {
  clientId: string;
  domain: string;
  refreshToken: string;
  tokenName: string;

  constructor(clientId: string, domain: string, refreshToken: string, tokenName: string) {
    this.clientId = clientId;
    this.domain = domain;
    this.refreshToken = refreshToken;
    this.tokenName = tokenName;
  }
}

export function provideAuth0Http(auth0Http: OpaqueToken, config: Auth0HttpConfig): Provider {
  return {
    provide: auth0Http,
    deps: [Http],
    useFactory: (http: Http) => {
      return new Auth0Http(config, http);
    }
  };
};
