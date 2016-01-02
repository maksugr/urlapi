# Urlapi originals repository

*Repository of [npm module - urlapi](https://www.npmjs.com/package/urlapi)*

## Instruction for working with this repository

This repository contains original code es2015 of `urlapi` that compiled by `grunt` and `babel` to folder `dist`.

First of all you need to install all dependencies

`npm install`

then start [grunt](https://www.npmjs.com/package/grunt) from you cmd/terminal

`grunt`

It will compile original code to `dist` in realtime

`app.js` contains examples for working with `urlapi`.

`node app` in cmd/terminal for start application

In folder `test` you can also find tests on [mocha](https://www.npmjs.com/package/mocha). I prefer to install `mocha` globally:

`npm install mocha -g`

then start `mocha` in `dist` folder

`mocha`

Also in `dist` you can find `coverage` folder that contains reports of [istanbul](https://www.npmjs.com/package/istanbul) what percentage of test coveraged

Install `istanbul`

`npm install istanbul -g`

and run in `dist`

`istanbul cover _mocha`

# Urlapi instruction

Urlapi contains methods for working with url:
- serialize from object to string (`serialize({ })`);
- parse string to object (`parse(' ')`).

Good abilities for working with queries and authentication in object types.

## Installation

In your cmd/terminal

`npm install urlapi`

then add module to your project

`var urlapi = require('urlapi');`

or for ES2015 use

`import * as urlapi from 'urlapi';`

## urlapi.serialize({ })

**Takes object with next attributes and return string**
- `protocol`: protocol with or without colon-slash-slash, colon (example: `http`, `http://`, `mailto:`) - `string`;
- `auth`: authentication data (example: `user:password`, `{ login: 'user', password: 'password'}`) - `string or object`;
- `host`: hostname and port if exist (example: `site_name.com:3333`, `site_name.com`, `localhost`) - `string`;
- `hostname`: hostname (example: `site_name.com`) - `string`;
- `port`: port (example: `3333`) - `string or number`;
- `path`: full path with search and queries (with or without leading slash) (example: `path/inner/page?ref=1&close=false`) - `string`;
- `pathname`: path without search and queries (with or without leading slash) (example: `path/inner/page`) - `string`;
- `search`: part of path with leading question mark (with or without question mark) (example: `?ref=1&close=false`) - `string`;
- `query`: part of path with parameters (example: `ref=1&close=false`, `{ref: '1', close: 'false'}`) - `string or object`;
- `hash`: part of url with pound-sign (with or without pound-sign) (example: `#g=where&a=find`, `{g: 'where', a: 'find'}`) - `string or object`;

**Additionaly:**
- None attribute is required but add to object `protocol` and `host` is good idea.
- If `host` exist `hostname` and `port` will not touch.
- If `path` exist `pathname`, `search`, `query` will not touch.

**Example**
```
import * as urlapi from 'urlapi';

let preparedObject = {
    protocol: 'http',
    auth: {
        login : 'user',
        password: 'password'
    },
    host: 'site_name.com:3333',
    hostname: 'site_name.com',
    port: 3333,
    path: 'path/inner/page?ref=1&close=false',
    pathname: 'path/inner/page',
    search: '?ref=1&close=false',
    query: {
        ref: '1',
        close: 'false'
    },
    hash: {
        g: 'where',
        a: 'find'
    }
};

console.log(urlapi.serialize(preparedObject));

return -->

http://user:password@site_name.com:3333/path/inner/page?ref=1&close=false#g=where&a=find
```

## urlapi.parse(' ')
**Takes string and return object**

**Additionaly:**
- None attribute is required but add to object `protocol` and `host` is good idea.

**Example**
```
import * as urlapi from 'urlapi';

let stringParse = 'http://user:password@site_name.com:3333/path/inner/page?ref=1&close=false#g=where&a=find';

console.log(urlapi.parse(stringParse));

return -->

{
    protocol: 'http',
    auth: {
        login : 'user',
        password: 'password'
    },
    host: 'site_name.com:3333',
    hostname: 'site_name.com',
    port: 3333,
    path: 'path/inner/page?ref=1&close=false',
    pathname: 'path/inner/page',
    search: '?ref=1&close=false',
    query: {
        ref: '1',
        close: 'false'
    },
    hash: {
        g: 'where',
        a: 'find'
    }
}
```