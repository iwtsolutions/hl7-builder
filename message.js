var Segment = require('./segment');
var Field = require('./field');

module.exports = function (options) {
    options = options || { };
    options.delimiters = options.delimiters || {};

    this.segments = [];
    this.delimiters = {
        field: options.delimiters.field || '|',
        component: options.delimiters.component || '^',
        repeat: options.delimiters.repeat || '~',
        escape: options.delimiters.escape || '\\',
        subComponent: options.delimiters.subComponent || '&'
    };

    addMessageHeader.bind(this)(options);

    this.add = function(segment) {
        var segmentName = segment.fields[0].repeats[0][0];

        if (segmentName === 'MSH')
            throw new Error('Cannot add another message header. One is automatically added.');

        this.segments.push(segment);
    };

    this.toString = function() {
        var result = '';

        for (var i in this.segments) {
            result += buildSegment.bind(this)(this.segments[i]);
        }

        return result;
    };

    function buildSegment(segment) {
        var fieldList = [];
        for (var i in segment.fields) {
            fieldList.push(buildField.bind(this)(segment.fields[i]));
        }
        return fieldList.join(this.delimiters.field);
    }

    function buildField(field) {
        var fieldStrings = [];
        for (var repeat in field.repeats) {
            fieldStrings.push(field.repeats[repeat].join(this.delimiters.component));
        }
        return fieldStrings.join(this.delimiters.repeat);
    }

    function addMessageHeader(options) {
        var segment = new Segment('MSH');
        segment.update(1, this.delimiters.component + 
            this.delimiters.repeat +
            this.delimiters.escape +
            this.delimiters.subComponent);
        segment.update(2, options.sendingApplication || '');
        segment.update(3, options.sendingFacility || '');
        segment.update(4, options.receivingApplication || '');
        segment.update(5, options.receivingFacility || '');

        var d = new Date();
        segment.update(6, d); // TODO

        var messageTypeField = new Field();
        messageTypeField.update(0, options.messageType);
        messageTypeField.update(1, options.messageEvent);
        segment.update(8, messageTypeField);

        segment.update(10, 'D');
        segment.update(11, '2.3');
        this.segments.push(segment);
    }
};
