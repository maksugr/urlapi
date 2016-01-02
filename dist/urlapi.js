'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.serialize = serialize;
exports.parse = parse;

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

//serialize from object to string
function serialize(url) {

    //check on object and fields exist
    if ((typeof url === 'undefined' ? 'undefined' : _typeof(url)) !== 'object' || Array.isArray(url) || !checkObj(url)) {
        throw new Error("Not the object or the object doesn't have any compulsory fields");
    }

    //hold result string
    var resultStringUrl = '';

    //init function for each filed in object
    protocol(url);
    auth(url);
    hostPort(url);
    pathSearchQuery(url);
    hash(url);

    //return result url string
    return resultStringUrl;

    //protocol function
    function protocol(url) {
        if (url.protocol !== undefined && typeof url.protocol === 'string') {
            //append to variable protocol and clean from / and :, and trim
            var _protocol = url.protocol.replace(/\W/g, '').trim();
            //if http, https, ftp, gopher, file
            if (_protocol === 'http' || _protocol === 'https' || _protocol === 'ftp' || _protocol === 'gopher' || _protocol === 'file') {
                //add ://
                resultStringUrl += _protocol + '://';
            } else {
                //add :
                resultStringUrl += _protocol + ':';
            }
        }
    }

    //auth function
    function auth(url) {
        if (url.auth !== undefined && typeof url.auth === 'string') {
            resultStringUrl += url.auth.trim() + '@';
        } else if (url.auth !== undefined && url.auth !== null && _typeof(url.auth) === 'object' && !Array.isArray(url.auth)) {
            //add auth login and password to resultStringUrl
            resultStringUrl += url.auth.login + ':' + url.auth.password + '@';
        }
    }

    //host, hostname and port function
    function hostPort(url) {
        //if host exist we use only him
        if (url.host !== undefined && typeof url.host === 'string') {
            resultStringUrl += url.host.trim();
        } else {
            //else we use hostname and port if exist
            if (url.hostname !== undefined && typeof url.hostname === 'string') {
                //add port if port exist and string or number
                if (url.port !== undefined && typeof url.port === 'string' || typeof url.port === 'number') {
                    //if port number do nothing
                    if (typeof url.port === 'number') {
                        resultStringUrl += url.hostname.trim() + ':' + url.port;
                    } else {
                        //if port string trim
                        resultStringUrl += url.hostname.trim() + ':' + url.port.trim();
                    }
                    //if port doesn't exist
                } else {
                        resultStringUrl += url.hostname.trim();
                    }
            }
        }
    }

    //path, pathName function and searchAndQuery function init
    function pathSearchQuery(url) {
        //if path exist we use only him
        if (url.path !== undefined && typeof url.path === 'string') {
            //if starts with /
            if (url.path.substring(0, 1) === '/') {
                resultStringUrl += url.path.trim();
            } else {
                resultStringUrl += '/' + url.path.trim();
            }
        } else {
            //we use path and then init searchAndQuery function
            if (url.pathname !== undefined && typeof url.pathname === 'string') {
                //if starts with /
                if (url.pathname.substring(0, 1) === '/') {
                    resultStringUrl += url.pathname.trim();
                } else {
                    resultStringUrl += '/' + url.pathname.trim();
                }
                searchAndQuery(url);
                //if pathname doesn't exist
            } else {
                    resultStringUrl += '/';
                    searchAndQuery(url);
                }
        }
    }

    //search and query function
    function searchAndQuery(url) {
        //if search exist we use only him
        if (url.search !== undefined && typeof url.search === 'string') {
            //if starts with ?
            if (url.search.substring(0, 1) === '?') {
                resultStringUrl += url.search.trim();
            } else {
                resultStringUrl += '?' + url.search.trim();
            }
            //else use query
        } else {
                if (url.query !== undefined && typeof url.query === 'string') {
                    //if starts with /
                    if (url.query.substring(0, 1) === '/') {
                        //if result string ends with /
                        if (resultStringUrl.substr(-1) !== "/") {
                            resultStringUrl += '' + url.query.trim();
                        } else {
                            resultStringUrl += '' + url.query.substr(1).trim();
                        }
                    } else {
                        //if result string ends with /
                        if (resultStringUrl.substr(-1) !== "/") {
                            resultStringUrl += '/' + url.query.trim();
                        } else {
                            resultStringUrl += '' + url.query.trim();
                        }
                    }
                } else if (url.query !== undefined && _typeof(url.query) === 'object' && !Array.isArray(url.query)) {
                    if (url.pathname === undefined || url.pathname !== null) {
                        resultStringUrl += '/';
                    }
                    addQueryObj(url.query);
                }
            }
    }

    //hash function
    function hash(url) {
        if (url.hash !== undefined && typeof url.hash === 'string') {
            //if starts with #
            if (url.hash.substring(0, 1) === '#') {
                resultStringUrl += url.hash.trim();
            } else {
                resultStringUrl += '#' + url.hash.trim();
            }
        } else if (url.hash !== undefined && _typeof(url.hash) === 'object' && !Array.isArray(url.hash)) {
            //add #
            resultStringUrl += '#';
            addQueryObj(url.hash);
        }
    }

    //add query to resultStringUrl if query is object
    function addQueryObj(queryContainer) {
        //add each query to resultStringUrl
        for (var query in queryContainer) {
            resultStringUrl += query + '=' + queryContainer[query] + '&';
        }
        //remove last &
        resultStringUrl = resultStringUrl.slice(0, -1);
    }

    //check object if it doesn't have any required field
    function checkObj(url) {
        //list of fields
        var fields = ['protocol', 'auth', 'host', 'hostname', 'port', 'path', 'pathname', 'search', 'query', 'hash'];
        for (var field in url) {
            for (var i = 0; i < fields.length; i++) {
                //if field exist in object exit and return tumbler (true)
                if (field === fields[i]) {
                    return true;
                }
            }
        }
        return false;
    }
}

//parse from string to object
//for stable work need specified protocol
function parse(url) {

    //check type of string and empty
    if (typeof url !== 'string' || url.trim() === '') {
        throw new Error('Type of url is not string or empty string');
    }

    //hold result object
    var resultObj = {};

    url = url.trim();

    //init functions
    protocol(url);
    auth(url);
    host(url);
    hostnamePort();
    path(url);
    pathnameSearchQuery();
    hash();

    //return result object
    return resultObj;

    //protocol function
    function protocol(url) {
        //if auth exist
        if (url.indexOf('@') > -1) {
            //count all colons before @
            if (url.match(/[^@]*/)[0].match(/:/g).length === 2) {
                //all before first colon
                resultObj.protocol = url.match(/[^:]*/)[0];
            } else {
                resultObj.protocol = null;
            }
        } else {
            //if we haven't auth and doesn't find colon
            if (url.match(/[^:]*/)[0] === url) {
                resultObj.protocol = null;
            } else {
                //all before first colon
                resultObj.protocol = url.match(/[^:]*/)[0];
            }
        }
    }

    //auth function
    function auth(url) {
        //if auth exist
        if (url.indexOf('@') > -1) {
            if (resultObj.protocol !== null) {
                //all between first colon and @ and replace ://
                resultObj.auth = url.match(/:([^@]*)/)[0].replace(/:?\/?\//, '');
                //create login and password fields in resultObj.auth
                var authHolder = resultObj.auth.split(':');
                resultObj.auth = {
                    login: authHolder[0],
                    password: authHolder[1]
                };
            } else {
                //all before @
                resultObj.auth = url.match(/[^@]*/)[0];
                var authHolder = resultObj.auth.split(':');
                resultObj.auth = {
                    login: authHolder[0],
                    password: authHolder[1]
                };
            }
        } else {
            resultObj.auth = null;
        }
    }

    //host function
    function host(url) {
        if (resultObj.auth !== null) {
            //remove all before @ and / and replace @
            resultObj.host = url.match(/@([^\/]*)/)[0].replace(/@/, '');
        } else if (resultObj.protocol !== null) {
            //take all after colon then replace :// and take all before first /
            resultObj.host = url.match(/:(.*)/)[0].replace(/:/, '').replace(/\/\//, '').split('/')[0];
        } else {
            //take all before /
            resultObj.host = url.match(/[^\/]*/)[0];
        }
        if (resultObj.host === '') {
            resultObj.host = null;
        }
    }

    //hostnamePort function
    function hostnamePort() {
        if (resultObj.host !== null) {
            //split host on two parts
            var devideOnTwoParts = resultObj.host.split(':');
            //append each part to hostname and port
            resultObj.hostname = devideOnTwoParts[0];
            //if port doesn't exist
            if (devideOnTwoParts[1] === undefined) {
                resultObj.port = null;
            } else {
                resultObj.port = devideOnTwoParts[1];
            }
        } else {
            resultObj.hostname = resultObj.port = null;
        }
    }

    //path function
    function path(url) {
        if (resultObj.host !== null) {
            //take all after host, replace /, remove hash
            resultObj.path = url.split(resultObj.host)[1].replace(/\//, '').match(/[^#]*/)[0];
        } else if (resultObj.auth !== null) {
            //take all after auth, replace @/, remove hash
            resultObj.path = url.split(resultObj.auth)[1].replace(/@\//, '').match(/[^#]*/)[0];
        } else if (resultObj.protocol !== null) {
            //take all after protocol, replace :// and :///, remove hash
            resultObj.path = url.split(resultObj.protocol)[1].replace(/:\/\/?\//, '').match(/[^#]*/)[0];
        }
        if (resultObj.path === '') {
            resultObj.path = null;
        }
    }

    //pathname, search, query function
    function pathnameSearchQuery() {
        if (resultObj.path !== null && resultObj.path.indexOf('?') > -1) {
            //all before ?
            if (resultObj.path.indexOf('?') === 0) {
                resultObj.pathname = null;
            } else {
                resultObj.pathname = resultObj.path.match(/[^?]*/)[0];
            }
            //all after ?
            resultObj.search = resultObj.path.match(/\?(.*)/)[0];
            //remove ?
            resultObj.query = resultObj.search.replace('?', '');
            //parsing query
            if (resultObj.query.indexOf('=') > -1) {
                resultObj.query = parsingQuery(resultObj.query);
            }
        } else {
            resultObj.pathname = resultObj.search = resultObj.query = null;
        }
    }

    //hash function
    function hash() {
        //all after #
        if (url.indexOf('#') > -1) {
            resultObj.hash = url.match(/#(.*)/)[0].replace('#', '');
            //parsing queries from hash
            if (resultObj.hash.indexOf('=') > -1) {
                resultObj.hash = parsingQuery(resultObj.hash);
            }
        } else {
            resultObj.hash = null;
        }
    }

    //function for parsing query
    function parsingQuery(queryContainer) {
        //query object holder
        var queryObj = {};
        //query split holder
        var querySplit = queryContainer.split('&');
        //parse each query with add field and value to queryObject
        querySplit.forEach(function (item) {
            var itemSplit = item.split('=');
            queryObj[itemSplit[0]] = itemSplit[1];
        });
        return queryObj;
    }
}
