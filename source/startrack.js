/* eslint-disable no-console */
(function (W) {
    var WD = W.document,
        // WDB = WD.body,
        // https://caniuse.com/#search=currentScript
        CS = WD.currentScript,
        dataSet = CS.dataset,
        head = document.getElementsByTagName('head').item(0),
        /* eslint-disable prefer-template */
        workerPath = (dataSet.worker || 'worker') + '.js',
        workerSettings = (dataSet.settings || 'settings') + '.js',
        /* eslint-enable prefer-template */
        worker,
        onReady = (function () {
            var cb = [],
                readyStateCheckInterval = setInterval(function () {
                    if (document.readyState === 'complete') {
                        clearInterval(readyStateCheckInterval);
                        for (var i = 0, l = cb.length; i < l; i++) {
                            cb[i].call(this);
                        }
                    }
                }, 10);
            return function (c) {
                if (document.readyState === 'complete') {
                    c.call(this);
                } else {
                    cb.push(c);
                }
            };
        })(),
        sendBeacon;
    try {
        // https://caniuse.com/#search=worker
        worker = new W.Worker(workerPath);
    } catch (e) {
        console.log('[MAIN]: ERR');
        console.log(e);
    }

    worker.onmessage = function (event) {
        var data = JSON.parse(event.data),
            script;
        switch (data.TYPE) {
            case 'INFO':
                console.log('[MAIN]: A info message is back');
                console.log(data);
                break;
            case 'READY':
                console.log('[MAIN]: READY');
                worker.postMessage({
                    TYPE: 'PROCESS'
                });
                break;
            case 'LOAD':
                console.log('[MAIN]: LOAD - message is back');
                console.log(data);
                script = document.createElement('script');
                script.onload = function () {
                    worker.postMessage({
                        TYPE: 'LOADED',
                        WHAT: data
                    });
                };
                script.innerText = data.data.response;
                head.appendChild(script);
                break;
            default:;
        }
    };
    onReady(start);

    function start () {
        worker.postMessage({
            TYPE: 'INIT',
            _settings: workerSettings,
            nav: navigator.userAgent,
            date: new Date(),
            location: {
                href: document.location.href,
                origin: document.location.origin,
                protocol: document.location.protocol,
                host: document.location.host,
                hostname: document.location.hostname,
                port: document.location.port,
                pathname: document.location.pathname,
                search: document.location.search,
                hash: document.location.hash
            },
            cookie: document.cookie
        });
    }
})(this);
