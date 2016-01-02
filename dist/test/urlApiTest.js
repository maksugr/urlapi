'use strict';

var _urlapi = require('../urlapi');

var urlapi = _interopRequireWildcard(_urlapi);

var _comparejs = require('comparejs');

var cmp = _interopRequireWildcard(_comparejs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var expect = require('chai').expect;
//for compare two objects not by references but by contents

//for clone objects
var clone = require('clone');

//function for changing of original object - need for testing different situations
function objChanging() {
    var objectCloned = clone(objectSerialized);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var arg = _step.value;

            objectCloned[arg[0]] = arg[1];
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return objectCloned;
}

//prepare data
var objectSerialized = {
    protocol: 'http',
    auth: { login: 'user', password: 'password' },
    host: 'site_name.com:3333',
    hostname: 'site_name.com',
    port: '3333',
    path: 'path/inner/page?ref=1&close=false',
    pathname: 'path/inner/page',
    search: '?ref=1&close=false',
    query: { ref: '1', close: 'false' },
    hash: { g: 'where', a: 'find' }
};
var stringParse = 'http://user:password@site_name.com:3333/path/inner/page?ref=1&close=false#g=where&a=find';

//start tests

describe("Tests for urlapi", function () {

    //serialize()
    describe("serialize()", function () {
        it("should create identical string from object and be a string", function () {
            var resultsType = _typeof(urlapi.serialize(objectSerialized));
            var results = urlapi.serialize(objectSerialized);
            expect(resultsType).to.equal('string');
            expect(results).to.equal(stringParse);
        });
        it("should throw an error", function () {
            //array
            expect(function () {
                urlapi.serialize([1, 3]);
            }).to.throw(Error);
            //string
            expect(function () {
                urlapi.serialize('string');
            }).to.throw(Error);
            //date
            expect(function () {
                urlapi.serialize(new Date());
            }).to.throw(Error);
            //number
            expect(function () {
                urlapi.serialize(1);
            }).to.throw(Error);
            //boolean
            expect(function () {
                urlapi.serialize(true);
            }).to.throw(Error);
            //undefined
            expect(function () {
                urlapi.serialize(undefined);
            }).to.throw(Error);
            //null
            expect(function () {
                urlapi.serialize(null);
            }).to.throw(Error);
            //function
            expect(function () {
                urlapi.serialize(function () {});
            }).to.throw(Error);
            //bad object
            expect(function () {
                urlapi.serialize({ 'a': 1 });
            }).to.throw(Error);
        });
        it("should check protocols adding :// or :", function () {
            function stringProtocol(protocol) {
                if (protocol === 'https' || protocol === 'ftp' || protocol === 'gopher' || protocol === 'file') {
                    var stringProtocol = '://user:password@site_name.com:3333/path/inner/page?ref=1&close=false#g=where&a=find';
                } else {
                    var stringProtocol = ':user:password@site_name.com:3333/path/inner/page?ref=1&close=false#g=where&a=find';
                }
                stringProtocol = '' + protocol + stringProtocol;
                return stringProtocol;
            }
            //https
            expect(urlapi.serialize(objChanging(['protocol', 'https']))).to.equal(stringProtocol('https'));
            //ftp
            expect(urlapi.serialize(objChanging(['protocol', 'ftp']))).to.equal(stringProtocol('ftp'));
            //gopher
            expect(urlapi.serialize(objChanging(['protocol', 'gopher']))).to.equal(stringProtocol('gopher'));
            //file
            expect(urlapi.serialize(objChanging(['protocol', 'file']))).to.equal(stringProtocol('file'));
            //foo
            expect(urlapi.serialize(objChanging(['protocol', 'foo']))).to.equal(stringProtocol('foo'));
        });
        it("should check for string auth", function () {
            expect(urlapi.serialize(objChanging(['auth', 'user:password']))).to.equal(stringParse);
        });
        it("should check for null host", function () {
            expect(urlapi.serialize(objChanging(['host', null]))).to.equal(stringParse);
        });
        it("should check for number port (it can be only if host null)", function () {
            expect(urlapi.serialize(objChanging(['host', null], ['port', 3333]))).to.equal(stringParse);
        });
        it("should check for null port (it can be only if host null)", function () {
            var stringParse = 'http://user:password@site_name.com/path/inner/page?ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['host', null], ['port', null]))).to.equal(stringParse);
        });
        it("should check if path starts with /", function () {
            expect(urlapi.serialize(objChanging(['path', '/path/inner/page?ref=1&close=false']))).to.equal(stringParse);
        });
        it("should check if null path", function () {
            expect(urlapi.serialize(objChanging(['path', null]))).to.equal(stringParse);
        });
        it("should check if pathname starts with / (it can be only if path null)", function () {
            expect(urlapi.serialize(objChanging(['path', null], ['pathname', '/path/inner/page']))).to.equal(stringParse);
        });
        it("should check if null pathname / (it can be only if path null)", function () {
            var stringParse = 'http://user:password@site_name.com:3333/?ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['path', null], ['pathname', null]))).to.equal(stringParse);
        });
        it("should check if search doesn't start with ? (it can be only if path null)", function () {
            expect(urlapi.serialize(objChanging(['path', null], ['search', 'ref=1&close=false']))).to.equal(stringParse);
        });
        it("should check if null search (it can be only if path null)", function () {
            var stringParse = 'http://user:password@site_name.com:3333/path/inner/page/ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['path', null], ['search', null]))).to.equal(stringParse);
        });
        it("should check if null search and pathname null (it can be only if path null)", function () {
            var stringParse = 'http://user:password@site_name.com:3333/ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['path', null], ['pathname', null], ['search', null]))).to.equal(stringParse);
        });
        it("should check if string query (it can be only if path null, pathname null, search null)", function () {
            var stringParse = 'http://user:password@site_name.com:3333/ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['path', null], ['pathname', null], ['search', null], ['query', 'ref=1&close=false']))).to.equal(stringParse);
        });
        it("should check if string query with / (it can be only if path null, pathname null, search null)", function () {
            var stringParse = 'http://user:password@site_name.com:3333/ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['path', null], ['pathname', null], ['search', null], ['query', '/ref=1&close=false']))).to.equal(stringParse);
        });
        it("should check if string hash", function () {
            expect(urlapi.serialize(objChanging(['hash', 'g=where&a=find']))).to.equal(stringParse);
        });
        it("should check if string hash has #", function () {
            expect(urlapi.serialize(objChanging(['hash', '#g=where&a=find']))).to.equal(stringParse);
        });
    });

    //parse()
    describe("parse()", function () {
        it("should create identical object from string and be an object", function () {
            expect(_typeof(urlapi.parse(stringParse))).to.equal('object');
            expect(cmp.eq(urlapi.parse(stringParse), objectSerialized)).to.equal(true);
        });
        it("should throw an error", function () {
            //not a string
            expect(function () {
                urlapi.parse([1, 3]);
            }).to.throw(Error);
            //empty string
            expect(function () {
                urlapi.parse('    ');
            }).to.throw(Error);
        });
        it("should test if we haven't auth", function () {
            var result = 'http://site_name.com:3333/path/inner/page?ref=1&close=false#g=where&a=find';
            expect(cmp.eq(urlapi.parse(result), objChanging(['auth', null]))).to.equal(true);
        });
        it("should create auth if we haven't protocol", function () {
            var result = 'user:password@site_name.com:3333/path/inner/page?ref=1&close=false#g=where&a=find';
            expect(cmp.eq(urlapi.parse(result), objChanging(['protocol', null]))).to.equal(true);
        });
        it("should create null port", function () {
            var result = 'http://user:password@site_name.com/path/inner/page?ref=1&close=false#g=where&a=find';
            expect(cmp.eq(urlapi.parse(result), objChanging(['port', null], ['host', 'site_name.com']))).to.equal(true);
        });
        it("should create null path", function () {
            var result = 'http://user:password@site_name.com:3333/#g=where&a=find';
            expect(cmp.eq(urlapi.parse(result), objChanging(['path', null], ['pathname', null], ['query', null], ['search', null]))).to.equal(true);
        });
        it("should create null pathname", function () {
            var result = 'http://user:password@site_name.com:3333/?ref=1&close=false#g=where&a=find';
            expect(cmp.eq(urlapi.parse(result), objChanging(['pathname', null], ['search', '?ref=1&close=false'], ['path', '?ref=1&close=false']))).to.equal(true);
        });
        it("should create null hash", function () {
            var result = 'http://user:password@site_name.com:3333/path/inner/page?ref=1&close=false';
            expect(cmp.eq(urlapi.parse(result), objChanging(['hash', null]))).to.equal(true);
        });
    });
});
