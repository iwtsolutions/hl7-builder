var Field = require('./field');

module.exports = function(segmentName) {
    this.fields = [];
    
    if (!segmentName || segmentName.length !== 3) {
        throw new Error('Segment header must be set.');
    }

    this.fields.push(createFieldFromString(segmentName.toUpperCase()));

    this.update = function(location, field) {
        if (location === 0) {
            throw new Error('Cannot set segment name through update.');
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
        }
        else {
            field = new Field();
        }

        this.fields[location] = field;

        if (location === 0) {
            this.fields[location].repeats[0][0] = this.fields[location].repeats[0][0].toUpperCase();
        }
    };

    function createFieldFromString(fieldValue) {
        var field = new Field();
        field.update(0, fieldValue);
        return field;
    }
};
