// eslint-disable-next-line no-unused-vars
var st = (function () {
    function req (url, cb) {
        // eslint-disable-next-line no-undef
        var oReq = new XMLHttpRequest();
        // oReq.contentType = 'application/javascript';
        oReq.onload = function () {
            oReq.status === 200
                && cb(
                    /**
                     * IE sucks forever
                     * ----------------
                     * this is just for fucking IE, since in the xhr
                     * the type has to be set lately (after open!!!!),
                     * anyway the type could not be json, and anyway looks
                     * to be always a string.
                     *
                     * this is a quick & dirty fix for a browser that has always been
                     * and will always be a fucking nasty browser
                     */
                    oReq.response
                );
        };
        oReq.open('GET', url, true);
        // oReq.setRequestHeader('Accept', 'application/javascript; charset=utf-8');
        // oReq.responseType = 'text';
        oReq.send();
    }
    return {
        req: req
    };
})();
