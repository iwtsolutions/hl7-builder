module.exports = function(length) {
    this.repeatIndex = 0;
    this.repeats = [ new Array(length || 0) ];

    this.update = function(location, data) {
        if (location > this.repeats[this.repeatIndex].length) {
            for (var i = this.repeats[this.repeatIndex].length; i < location; i++) {
                this.repeats[this.repeatIndex].push('');
            }
        }

        this.repeats[this.repeatIndex][location] = (data || '');
    };

    this.repeat = function() {
        var arrayLength = this.repeats[this.repeatIndex].length;
        var newArray = new Array(arrayLength).join('.').split('.');
        this.repeats.push(newArray);
        this.repeatIndex++;
    };
};
