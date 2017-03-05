import * as clubber from 'clubber';

const analyser = new Clubber({
	size: 2048,
	mute: false,
	thresholdFactor: .25
});

var audioSource = document.getElementById('audio');
analyser.listen(audioSource); 

var bands = {
    sub: analyser.band({
        from: 5, 
        to: 32, 
        smooth: [0.1, 0.1, 0.1, 0.1] // Exponential smoothing factors for each of the four returned values
    }),

    low: analyser.band({
        from: 32, 
        to: 48, 
        smooth: [0.1, 0.1, 0.1, 0.1] // Exponential smoothing factors for each of the four returned values
    }),

    mid: analyser.band({
        from: 48,
        to: 64,
        smooth: [0.1, 0.1, 0.1, 0.1]
    }),

    high: analyser.band({
        from: 64,
        to: 160,
        smooth: [0.1, 0.1, 0.1, 0.1]
    })
};

export { analyser, bands };