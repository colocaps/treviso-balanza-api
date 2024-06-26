# nestjs-supabase-setup

> This is an example for Supabase v1. The API has changed in later versions, but the most important idea here - use NestJS's Services with the correct scope to have a separate `SupabaseInstance` for different requests https://docs.nestjs.com/fundamentals/injection-scopes

## Description
This is an example of how to setup and use Supabase with Nest.js: Auth and Client.
Follow the [article](https://blog.andriishupta.dev/setup-supabase-with-nestjs) for more info.

Using in your app:
- copy **supabase** folder
- import _SupabaseModule_ where you need
- add `APP_GUARD` for global Auth guarding or use `UseGuard()` per route
- use `supabase.getClient()` that will create you a "per request client" with `Scope.REQUEST` option - this is essential, such as we cannot `setAuth()` like on the client-side once

## Installation
```bash
$ npm install
```

## Running the app
- add valid .env file from your Supabase
- get user's `access_token`
- update code in _AppService_ that matches your business logic / table name / etc. 
- use `access_token` as your _Bearer Authorization_
- start application*
- make GET / request

```bash
$ npm run start
```
#   t r e v i s o - b a l a n z a - a p i  
 #   t r e v i s o - b a l a n z a - a p i  
 