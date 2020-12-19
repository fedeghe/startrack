/* eslint-disable no-console */
/* eslint-disable no-undef */
/*
* Project: startrack
* Version: 1.0.0
* Author: fFederico Ghedina <fedeghe@gmail.com>
*/
'use strict';

importScripts('lib.js');
console.log(st);
var settings = null,
    qManager = null,
    to = null;
self.to = to;
self.onmessage = function (e) {
    var data = e.data;
    if (!('TYPE' in data)) {
        console.warn('[WORKER]: no type given');
        return void 0;
    }
    switch (data.TYPE) {
        case 'INIT':
            console.log('[WORKER]: INIT - received the following initialization data: ', data);
            if (!('_settings' in data)) {
                throw new Error('[WORKER]: Settings must be passed');
            }
            importScripts(data._settings);
            if (settings) {
                qManager = new QueueManager(settings.pixels);
            }

            postInfo({ 'done': true });
            postReady();
            break;
        case 'PROCESS':
            if (settings === null) {
                throw new Error('[WORKER]: PROCESS - Settings not set');
            }
            qManager.process();
            break;
        case 'LOADED':
            console.log('[WORKER]: LOADED - ', data);
            break;
        default:console.log('Lazy Worker');
    }
};

function QueueManager (beacons) {
    this.beacons = beacons;
    this.len = beacons.length;
    this.cursor = 0;
}
QueueManager.prototype.process = function () {
    console.log('[WORKER]: processing ', this.cursor);
    var qm = this,
        next = this.beacons[this.cursor];
    console.log('script ', next.url);
    st.req(next.url, function (response) {
        console.log('[WORKER]: xhr response: \n---\n', response,'\n---\n');
        postLoad({ next: next, response: response });
        if (++qm.cursor < qm.len) {
            self.to(qm.process.bind(qm), next.time);
        }
    });
};

function postInfo (msg) { post('INFO', msg); }
function postReady (msg) { post('READY', msg); }
function postLoad (msg) { post('LOAD', msg); }

function post (type, data) {
    postMessage(JSON.stringify({
        TYPE: type,
        data: data
    }));
}
