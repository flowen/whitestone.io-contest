var h = {
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getSeqNegOrPos : function() {
        // returns -1 or 1 in sequence
        var n,
            b = false;

        if (!b) {
            n = -1;
            b = true;
        } else {
            n = 1;
            b = false;
        }
        return n;
    },
    getRandomNegOrPos : function() {
        // randomly return -1 and 1
        var n;
        if (Math.random() > 0.5){
            n = -1;
        } else {
            n = 1;
        }
        return n;
    },
    onError: function(error) {
        console.log('error');
        console.log(error);
    }
};

export default h;