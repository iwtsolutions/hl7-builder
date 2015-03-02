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

    this.add = function(location, data) {
        // TODO
    };

    this.toString = function() {
        var result = '';

        for (var segment in this._segments) {
            result += buildSegment(segment);
        }

        return result;
    };

    this.buildSegment = function(segment) {
        // TODO
    }
};
