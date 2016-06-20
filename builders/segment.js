var Field = require('./field');

module.exports = function (segmentName) {
    this.fields = [];

    if (!segmentName || segmentName.length !== 3) {
        throw new Error('Segment header must be set.');
    }

    this.fields.push(createFieldFromString(segmentName.toUpperCase()));

    this.set = function (location, field) {
        if (location === 0) {
            throw new Error('Cannot set segment name through set.');
        }

        if (location > this.fields.length) {
            for (var i = this.fields.length; i < location; i++) {
                this.fields.push(new Field(0));
            }
        }

        if (field) {
            if (typeof field !== 'object' || typeof field.repeat === 'undefined') {
                field = createFieldFromString(field);
            }
        } else {
            field = new Field();
        }

        this.fields[location] = field;

        if (location === 0) {
            this.fields[location].repeats[0][0] = this.fields[location].repeats[0][0].toUpperCase();
        }
    };

    this.get = function (index, repeatDelimiter, componentDelimiter, subComponentDelimiter) {
        if (isNaN(index) === false && index < this.fields.length) {
            var field = this.fields[index];
            return field.toString(repeatDelimiter, componentDelimiter, subComponentDelimiter);
        }
        return null;
    };

    this.getName = function () {
        return this.get(0);
    };

    this.toString = function (delimiters) {
        delimiters = delimiters || { };

        var fields = [];
        this.fields.forEach(function (field) {
            var fieldString = field.toString(
                delimiters.repeat,
                delimiters.component,
                delimiters.subComponent);

            fields.push(fieldString);
        });

        return fields.join(delimiters.field || '|');
    };

    function createFieldFromString(fieldValue) {
        var field = new Field();
        field.set(0, fieldValue);
        return field;
    }
};
