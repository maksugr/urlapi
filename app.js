import * as urlapi from './urlapi';

//prepared object for serialize
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

//prepared string for parsing
let stringParse = 'https://tonicdev.com/56884b906065940c00b019ee/56884b906065940c00b019ef';

//serializing preparedObject
console.log('-- serialized object --');
console.log(urlapi.serialize(preparedObject));

//parsing stringParse
console.log('-- parsed stringParse --');
console.log(urlapi.parse(stringParse));

//reverse serializing from object created by stringParse
console.log('-- reverse serializing from object created by stringParse --');
console.log(urlapi.serialize(urlapi.parse(stringParse)));

//huge url

let bigString = 'https://yandex.com/search/?text=2016%20tech%20trends&lr=2&wordforms=exact&lang=en&within=77';

//parsing huge string
console.log('-- parsed bigString --');
console.log(urlapi.parse(bigString));

//reverse serializing from bigString
console.log('-- reverse serializing from object created by bigString --');
console.log(urlapi.serialize(urlapi.parse(bigString)));
