var date    = new Date();
var parser  = require('L7');
var Segment = require('./segment');
var Field   = require('./field');

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

    this.add = function (segment) {
        if (segment.getName() === 'MSH') {
            throw new Error('Cannot add another message header. One is automatically added.');
        }

        this.segments.push(segment);
    };

    this.toString = function () {
        var segmentStrings = [];

        for (var i in this.segments) {
            segmentStrings.push(buildSegment.bind(this)(this.segments[i]));
        }

        return segmentStrings.join(this.delimiters.segment);
    };

    this.toQuery = function () {
        return parser.parse(this.toString());
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

    function addMessageHeader(headerOptions) {
        var segment = new Segment('MSH');
        segment.set(1, this.delimiters.component +
            this.delimiters.repeat +
            this.delimiters.escape +
            this.delimiters.subComponent);
        segment.set(2, headerOptions.sendingApplication || '');
        segment.set(3, headerOptions.sendingFacility || '');
        segment.set(4, headerOptions.receivingApplication || '');
        segment.set(5, headerOptions.receivingFacility || '');

        var timestamp = getTimestamp();
        segment.set(6, timestamp);

        var messageTypeField = new Field();
        messageTypeField.set(0, headerOptions.messageType);
        messageTypeField.set(1, headerOptions.messageEvent);

        segment.set(8, messageTypeField);
        segment.set(9, headerOptions.messageId || '');
        segment.set(10, 'D');
        segment.set(11, headerOptions.version || '2.3');
        this.segments.push(segment);

        if (headerOptions.eventSegment === true) {
            addEventSegment.bind(this)(headerOptions.messageEvent, timestamp);
        }
    }

    function addEventSegment(event, timestamp) {
        var segment = new Segment('EVN');
        segment.set(1, event);
        segment.set(2, timestamp);
        this.segments.push(segment);
    }

    function getTimestamp() {
        date.setMinutes(date.getMinutes() + 2);

        return date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2);
    }
};
