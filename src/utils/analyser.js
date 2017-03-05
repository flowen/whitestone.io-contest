import player from './audioplayer';
import createAnalyser from 'web-audio-analyser';

/* create audio analyser */
var audioUtil = createAnalyser(player.node, player.context, {
  stereo: false
});

var analyser = audioUtil.analyser;

// from: http://www.teachmeaudio.com/mixing/techniques/audio-spectrum
var bands = {
    sub: {
        from: 20, 
        to: 250
    },

    low: {
        from: 251,
        to: 500
    },

    mid: {
        from: 501,
        to: 3000
    },

    high: {
        from: 3001,
        to: 6000
    }
};


// todo create audio analyser in background
var analyserBands = {};
for (var i = 0; i < 12; i++) {
    var prev = i * 285;
    analyserBands[i] = {
        'from'  : prev + 1,
        'to'    : (i+1) * 285
    }
}
// console.log(analyserBands);



export { audioUtil, analyser, bands, analyserBands };