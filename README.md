<p align="center">
  <img src="https://i.imgur.com/dpdqxMa.png" width="200px">
</p>

<h1 align="center">
  Venturer
</h1>

<p align="center">
  Simple utilities for building SDKs and API clients. ✈🚀
</p>

## Install

```bash
# yarn
yarn add venturer

# npm
npm install --save venturer 
```

## Parameters

Venturer's `paramUrl` function makes it easy to handle rest-style path parameters.

Parameters must be wrapped in curly brackets, eg. `{userId}`. 
You can set the parameter using the string within the brackets, in this case `userId`.

A url can have as many parameters as you want.

```typescript
import { paramUrl } from 'venturer';

let url = paramUrl('/users/{userId}/post/{postId}');

url({ userId: '123', postId: 'abc' });
// > /users/123/post/abc
```

## Request

Venturer includes an easy-to-use request client based on [ky](https://github.com/sindresorhus/ky).

### Default client

The default client allows you to make simple request without setting up anything.

```typescript
import { request } from 'venturer';

// get
request.get('https://example.com', {
  // ky options
});

// delete
request.delete('https://example.com', {
  // ky options
});

// post
request.post('https://example.com', {
  // request body
}, {
  // ky options
});

// put
request.put('https://example.com', {
  // request body
}, {
  // ky options
});

// patch
request.patch('https://example.com', {
  // request body
}, {
  // ky options
});
```

### Custom client

A custom client allows you to set options for all request, like a url-prefix or auth token.

Custom clients have the same api as the default client.

```typescript
import { createClient } from 'venturer';

let client = createClient('https://api.example.com', {
  authorization: '<auth token>'
});

client.get('/user/123');
// makes a request to `https://api.example.com/user/123`
```

### Authentication

Venturer has built-in support for header-based authentication. By default it uses bearer auth.

```typescript
request.get('https://example.com', {
  authorization: '<auth token>'
});
// will set the `authorization` header to `bearer <auth token>`
```

You can optionally override the authorization header/scheme.

```typescript
request.get('https://example.com', {
  authorization: '<auth token>',
  authorizationHeader: 'auth',
  authorizationScheme: 'token'
});
// will set the `auth` header to `token <auth token>`
```
