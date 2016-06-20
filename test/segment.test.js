var should  = require('should');
var Field   = require('../builders/field');
var Segment = require('../builders/segment');

describe('Segment', function () {
    describe('set(location, field)', function () {
        it('should add a field from a given field function', function () {
            var field = new Field();
            field.set(0, 'value');

            var segment = new Segment('MSH');
            segment.set(1, field);

            segment.fields.length.should.equal(2);
        });

        it('should add a field from a given string', function () {
            var segment = new Segment('MSH');
            segment.set(1, 'field');

            segment.fields.length.should.equal(2);
            segment.fields[1].repeats[0][0].should.equal('field');
        });

        it('should add a field at location 6 and add other fields before it', function () {
            var segment = new Segment('MSH');
            segment.set(6, 'Value');
            segment.fields.length.should.equal(7);
        });

        it('should add an object as a field that is not a Field object', function () {
            var segment = new Segment('MSH');
            var d = new Date();
            segment.set(1, d);
            segment.fields.length.should.equal(2);
            segment.fields[1].repeats[0][0].should.equal(d);
        });
    });

    describe('new Segment(segmentName)', function () {
        it('should error without a segment name', function () {
            (() => new Segment()).should.throw();
        });

        it('should error with a segment name shorter or longer than 3', function () {
            (() => new Segment('a')).should.throw();
            (() => new Segment('aaaa')).should.throw();
        });

        it('should successfully create a header and capitalize it', function () {
            var segment = new Segment('msh');
            segment.fields[0].repeats[0][0].should.equal('MSH');
        });
    });

    describe('get()', function () {
        it('should get a field by an index', function () {
            var segment = new Segment('MSH');
            segment.set(6, 'Value');
            segment.get(6).should.equal('Value');
            segment.get(2).should.equal('');
        });

        it('should return null if an index is invalid', function () {
            var segment = new Segment('MSH');
            should.not.exist(segment.get(45));
        });
    });

    it('should return segment name on getName()', function () {
        var segment = new Segment('AAA');
        segment.getName().should.equal('AAA');

        var segment2 = new Segment('BBB');
        var field = new Field();
        field.set(0, 'value');
        field.repeat();
        field.set(3, 'foo');

        segment2.set(1, field);
        segment2.set(6, 'Value');
        segment2.getName().should.equal('BBB');
    });

    it('should capitalize segment name', function () {
        var segment = new Segment('asd');
        segment.getName().should.equal('ASD');
    });
});
