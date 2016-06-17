module.exports = function (length) {
    this.repeatIndex = 0;
    this.repeats = [ new Array(length || 0) ];

    this.update = function (location, data) {
        if (location > this.repeats[this.repeatIndex].length) {
            for (var i = this.repeats[this.repeatIndex].length; i < location; i++) {
                this.repeats[this.repeatIndex].push('');
            }
        }

        this.repeats[this.repeatIndex][location] = (data || '');
    };

    this.get = function (index, repeat) {
        if (repeat && (repeat > this.repeatIndex || repeat < 0)) {
            return null;
        }
        if (typeof repeat === 'undefined') {
            repeat = this.repeatIndex;
        }
        var repeatGroup = this.repeats[repeat];

        return index && index > -1 && index < repeatGroup.length ? repeatGroup[index] : null;
    };

    this.repeat = function () {
        var arrayLength = this.repeats[this.repeatIndex].length;
        var newArray = new Array(arrayLength).join('.').split('.');
        this.repeats.push(newArray);
        this.repeatIndex++;
    };

    this.toString = function (repeatDelimiter, componentDelimiter) {
        // TODO: Add subcomponents
        var fieldStrings = [];
        for (var repeat in this.repeats) {
            fieldStrings.push(this.repeats[repeat].join(componentDelimiter || '^'));
        }
        return fieldStrings.join(repeatDelimiter || '~');
    };
};
