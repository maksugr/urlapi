var expect = require('chai').expect;
import * as urlapi from '../urlapi';
//for compare two objects not by references but by contents
import * as cmp from 'comparejs';
//for clone objects
var clone = require('clone');

//function for changing of original object - need for testing different situations
function objChanging(...args) {
    var objectCloned = clone(objectSerialized);
    for (var arg of args) {
        objectCloned[arg[0]] = arg[1];
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

describe("Tests for urlapi", () => {

    //serialize()
    describe("serialize()", () => {
        it("should create identical string from object and be a string", () => {
            let resultsType = typeof urlapi.serialize(objectSerialized);
            let results = urlapi.serialize(objectSerialized);
            expect(resultsType).to.equal('string');
            expect(results).to.equal(stringParse);
        });
        it("should throw an error", () => {
            //array
            expect(() => {urlapi.serialize([1, 3])}).to.throw(Error);
            //string
            expect(() => {urlapi.serialize('string')}).to.throw(Error);
            //date
            expect(() => {urlapi.serialize(new Date())}).to.throw(Error);
            //number
            expect(() => {urlapi.serialize(1)}).to.throw(Error);
            //boolean
            expect(() => {urlapi.serialize(true)}).to.throw(Error);
            //undefined
            expect(() => {urlapi.serialize(undefined)}).to.throw(Error);
            //null
            expect(() => {urlapi.serialize(null)}).to.throw(Error);
            //function
            expect(() => {urlapi.serialize(() => {})}).to.throw(Error);
            //bad object
            expect(() => {urlapi.serialize({'a' : 1})}).to.throw(Error);
        });
        it("should check protocols adding :// or :", () => {
            function stringProtocol(protocol) {
                if (protocol === 'https' || protocol === 'ftp' ||
                    protocol === 'gopher' || protocol === 'file')
                {
                    var stringProtocol = '://user:password@site_name.com:3333/path/inner/page?ref=1&close=false#g=where&a=find';
                } else {
                    var stringProtocol = ':user:password@site_name.com:3333/path/inner/page?ref=1&close=false#g=where&a=find';
                }
                stringProtocol = `${protocol}${stringProtocol}`;
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
        it("should check for string auth", () => {
            expect(urlapi.serialize(objChanging(['auth', 'user:password']))).to.equal(stringParse);
        });
        it("should check for null host", () => {
            expect(urlapi.serialize(objChanging(['host', null]))).to.equal(stringParse);
        });
        it("should check for number port (it can be only if host null)", () => {
            expect(urlapi.serialize(objChanging(['host', null], ['port', 3333]))).to.equal(stringParse);
        });
        it("should check for null port (it can be only if host null)", () => {
            let stringParse = 'http://user:password@site_name.com/path/inner/page?ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['host', null], ['port', null]))).to.equal(stringParse);
        });
        it("should check if path starts with /", () => {
            expect(urlapi.serialize(objChanging(['path', '/path/inner/page?ref=1&close=false']))).to.equal(stringParse);
        });
        it("should check if null path", () => {
            expect(urlapi.serialize(objChanging(['path', null]))).to.equal(stringParse);
        });
        it("should check if pathname starts with / (it can be only if path null)", () => {
            expect(urlapi.serialize(objChanging(['path', null], ['pathname', '/path/inner/page']))).to.equal(stringParse);
        });
        it("should check if null pathname / (it can be only if path null)", () => {
            let stringParse = 'http://user:password@site_name.com:3333/?ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['path', null], ['pathname', null]))).to.equal(stringParse);
        });
        it("should check if search doesn't start with ? (it can be only if path null)", () => {
            expect(urlapi.serialize(objChanging(['path', null], ['search', 'ref=1&close=false']))).to.equal(stringParse);
        });
        it("should check if null search (it can be only if path null)", () => {
            let stringParse = 'http://user:password@site_name.com:3333/path/inner/page/ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['path', null], ['search', null]))).to.equal(stringParse);
        });
        it("should check if null search and pathname null (it can be only if path null)", () => {
            let stringParse = 'http://user:password@site_name.com:3333/ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['path', null], ['pathname', null], ['search', null]))).to.equal(stringParse);
        });
        it("should check if string query (it can be only if path null, pathname null, search null)", () => {
            let stringParse = 'http://user:password@site_name.com:3333/ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['path', null], ['pathname', null], ['search', null], ['query', 'ref=1&close=false']))).to.equal(stringParse);
        });
        it("should check if string query with / (it can be only if path null, pathname null, search null)", () => {
            let stringParse = 'http://user:password@site_name.com:3333/ref=1&close=false#g=where&a=find';
            expect(urlapi.serialize(objChanging(['path', null], ['pathname', null], ['search', null], ['query', '/ref=1&close=false']))).to.equal(stringParse);
        });
        it("should check if string hash", () => {
            expect(urlapi.serialize(objChanging(['hash', 'g=where&a=find']))).to.equal(stringParse);
        });
        it("should check if string hash has #", () => {
            expect(urlapi.serialize(objChanging(['hash', '#g=where&a=find']))).to.equal(stringParse);
        });
    });

    //parse()
    describe("parse()", () => {
        it("should create identical object from string and be an object", () => {
            expect(typeof urlapi.parse(stringParse)).to.equal('object');
            expect(cmp.eq(urlapi.parse(stringParse), objectSerialized)).to.equal(true);

        });
        it("should throw an error", () => {
            //not a string
            expect(() => {urlapi.parse([1, 3])}).to.throw(Error);
            //empty string
            expect(() => {urlapi.parse('    ')}).to.throw(Error);
        });
        it("should test if we haven't auth", () => {
            let result = 'http://site_name.com:3333/path/inner/page?ref=1&close=false#g=where&a=find';
            expect(cmp.eq(urlapi.parse(result), objChanging(['auth', null]))).to.equal(true);
        });
        it("should create auth if we haven't protocol", () => {
            let result = 'user:password@site_name.com:3333/path/inner/page?ref=1&close=false#g=where&a=find';
            expect(cmp.eq(urlapi.parse(result), objChanging(['protocol', null]))).to.equal(true);
        });
        it("should create null port", () => {
            let result = 'http://user:password@site_name.com/path/inner/page?ref=1&close=false#g=where&a=find';
            expect(cmp.eq(urlapi.parse(result), objChanging(['port', null], ['host', 'site_name.com']))).to.equal(true);
        });
        it("should create null path", () => {
            let result = 'http://user:password@site_name.com:3333/#g=where&a=find';
            expect(cmp.eq(urlapi.parse(result), objChanging(['path', null], ['pathname', null], ['query', null], ['search', null]))).to.equal(true);
        });
        it("should create null pathname", () => {
            let result = 'http://user:password@site_name.com:3333/?ref=1&close=false#g=where&a=find';
            expect(cmp.eq(urlapi.parse(result), objChanging(['pathname', null], ['search', '?ref=1&close=false'], ['path', '?ref=1&close=false']))).to.equal(true);
        });
        it("should create null hash", () => {
            let result = 'http://user:password@site_name.com:3333/path/inner/page?ref=1&close=false';
            expect(cmp.eq(urlapi.parse(result), objChanging(['hash', null]))).to.equal(true);
        });

    });

});