/* eslint-disable no-unused-vars */
var settings = {
        pixels: [{
            url: '//localhost:3001/dist/pixels/ga.js',
            type: 'script',
            time: 5000
        }, {
            url: '//localhost:3001/dist/pixels/fb.js',
            type: 'script',
            time: 500
        }]
    },
    to = function (fn, t) {
        return setTimeout(fn, t);
    };
/* eslint-enable no-unused-vars */
