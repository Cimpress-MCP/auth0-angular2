[![NPM version][npm-image]][npm-url]
[![License][license-image]](#license)
[![Downloads][downloads-image]][npm-url]

# Auth0 Angular2
Auth0 Angular2 library helps you easily integrate Auth0 with your Angular 2 application. Auth0 Angular2 is written in TypeScript.

## Installation
`npm install auth0-angular2`

and in your index.html

```html
<script src="http://cdn.auth0.com/js/lock/10.4/lock.min.js"></script>
```

(If you know how to include the Auth0 Lock dependency in the library, please contribute!)

## Using `provideAuthService`
Add `provideAuthService` to the `providers` array in your `@NgModule`.

```ts
import { provideAuthService } from 'auth0-angular2';

...

@NgModule({
  ...
  
  providers: [
    provideAuthService('clientId', 'domain')
  ],
  
  ...
})
```

After a successful login, Auth0 Lock by default redirects to the path that triggers the Lock and you may override it by providing a `/redirectPath` parameter. You may also provide a `/homePath` parameter to indicate where to route the application to after a successful login.    

`provideAuthService('clientId', 'domain', '/homePath', '/redirectPath')`

## Authenticating users
Using an authentication route guard as an example

```ts
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from 'auth0-angular2';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) { }
  
  canActivate() {
    if(this.auth.loginIfNotAuthenticated()){
      return false;
    }
    
    return true;
  }
}

```

## Sending authenticated HTTP requests
Please use [angular2-jwt](https://github.com/auth0/angular2-jwt) directly, which is already installed with this library.
(More features on sending authenticated HTTP requests are currently under development.)

## Contributing

Pull requests are welcome!

## Development

`npm install`

and

`npm run prepublish` to compile.

## Browser Compatibility

We currently ensure browser compatibility in Chrome only.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section.

## Author

[Cimpress MCP](https://github.com/Cimpress-MCP)

## License

This project is licensed under the Apache 2.0 license. See the [LICENSE](LICENSE) file for more info.


[npm-image]: https://img.shields.io/npm/v/auth0-angular2.svg
[npm-url]: https://npmjs.org/package/auth0-angular2
[license-image]: http://img.shields.io/npm/l/auth0-angular2.svg
[downloads-image]: http://img.shields.io/npm/dm/auth0-angular2.svg