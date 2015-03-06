var Segment = require('./segment');
var Field = require('./field');

module.exports = function (options) {
    if (!options || typeof options !== 'object') {
        throw new Error('Must define options.');
    }
    if (!options.messageType || !options.messageEvent) {
        throw new Error('Must define message type and message event');
    }

    options.delimiters = options.delimiters || {};

    this.segments = [];
    this.delimiters = {
        segment: options.delimiters.segment || '\r',
        field: options.delimiters.field || '|',
        component: options.delimiters.component || '^',
        repeat: options.delimiters.repeat || '~',
        escape: options.delimiters.escape || '\\',
        subComponent: options.delimiters.subComponent || '&'
    };

    addMessageHeader.bind(this)(options);

    this.add = function(segment) {
        var segmentName = segment.fields[0].repeats[0][0];

        if (segmentName === 'MSH') {
            throw new Error('Cannot add another message header. One is automatically added.');
        }

        this.segments.push(segment);
    };

    this.toString = function() {
        var segmentStrings = [];

        for (var i in this.segments) {
            segmentStrings.push(buildSegment.bind(this)(this.segments[i]));
        }

        return segmentStrings.join(this.delimiters.segment);
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

        segment.update(6, getTimestamp());

        var messageTypeField = new Field();
        messageTypeField.update(0, options.messageType);
        messageTypeField.update(1, options.messageEvent);

        segment.update(8, messageTypeField);
        segment.update(9, options.messageId || '');
        segment.update(10, 'D');
        segment.update(11, options.version || '2.3');
        this.segments.push(segment);
    }

    function getTimestamp() {
        var d = new Date();
        return d.getFullYear() + 
            ('0' + (d.getMonth() + 1)).slice(-2) +
            ('0' + d.getDate()).slice(-2) +
            ('0' + d.getHours()).slice(-2) +
            ('0' + d.getMinutes()).slice(-2);
    }
};
