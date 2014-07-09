/**
App Minimalizmo
MIT license 2013
Hajnal Dávid
*/
'use strict';

;
(function(app) {

    var DEV = true;

    var _log = function(message) {
        try {
            if (DEV) console.log(message);
        } catch (e) {

        }
    }

    var _objectToParam = function(paramObj) {

        var url = '';

        var isFirst = true;

        for (var paramName in paramObj) {

            if (!isFirst) {

                url += "&";

            } else {

                isFirst = false;

            }

            url += encodeURIComponent(paramName) + "=" + encodeURIComponent(paramObj[paramName]);
        }

        return url;

    }

    app.$ = function(selector) {

        return document.querySelectorAll(selector);

    }

    app.on = function(obj, type, fn) {
        if (obj.attachEvent) {
            form.attachEvent(type, fn);
        } else {
            obj.addEventListener(type, fn);
        }
    }

    app.post = function(url, paramObj, callback, json) {

        try {

            var xhr = new XMLHttpRequest();

            var params =
                (typeof paramObj === null || typeof paramObj === undefined) ? "" : _objectToParam(paramObj);

            xhr.open("POST", url, true);

            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Content-length', params.length);

            xhr.setRequestHeader('Connection', 'close');

            xhr.onreadystatechange = function() {

                if (xhr.readyState == 4) {

                    if (xhr.status == 200) {

                        if (callback && typeof(callback) === "function") {
                            if (json) {
                                callback(JSON.parse(xhr.response));
                            } else {
                                callback(xhr.response);
                            }

                        }
                    } else {
                        console.error(xhr.status);
                        throw new Error('xhr status = ' + xhr.status);

                    }

                }

            }

            xhr.send(params);

        } catch (e) {

            _log(e);

        }

    }

    app.get = function(url, paramObj, callback, json) {

        try {

            var xhr = new XMLHttpRequest();

            var params =
                (typeof paramObj === null || typeof paramObj === undefined) ? "" : _objectToParam(paramObj);


            // xhr.open( "GET" , url + params + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime() , true );

            xhr.open("GET", url, true);

            xhr.onreadystatechange = function() {

                if (xhr.readyState === 4) {

                    if (xhr.status === 200) {
                                            
                        if (callback && typeof(callback) === "function") {
                            if (json) {
                                callback(JSON.parse(xhr.response));
                            } else {
                                callback(xhr.response);
                            }

                        }

                    } else {
                        _log(xhr.status);
                        throw new Error('xhr status = ' + xhr.status);

                    }

                }

            }

            xhr.send(params);

        } catch (e) {

            _log(e);

        }

    }


    window.$ = app.$;


}(window.app = window.app || {}));