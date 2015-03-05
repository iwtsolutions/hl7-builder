var should = require('should');
var Field = require('../field');
var Segment = require('../segment');

describe('Segment', function() {
    describe('update(location, field)', function() {
        it('should add a field from a given field function', function() {
            var field = new Field();
            field.update(0, 'value');
            
            var segment = new Segment('MSH');
            segment.update(1, field);

            segment.fields.length.should.equal(2);
        });

        it('should add a field from a given string', function() {
            var segment = new Segment('MSH');
            segment.update(1, 'field');

            segment.fields.length.should.equal(2);
            segment.fields[1].repeats[0][0].should.equal('field');
        });

        it('should add a field at location 6 and add other fields before it', function() {
            var segment = new Segment('MSH');
            segment.update(6, 'Value');
            segment.fields.length.should.equal(7);
        });
    });

    describe('new Segment(segmentName)', function() {
        it('should error without a segment name', function() {
            (function() {
                var segment = new Segment();
            }).should.throw();
        });

        it('should error with a segment name shorter or longer than 3', function() {
            (function() {
                var segment = new Segment('a');
            }).should.throw();
            (function() {
                var segment = new Segment('aaaa');
            }).should.throw();
        });

        it('should successfully create a header and capitalize it', function() {
            var segment = new Segment('msh');
            segment.fields[0].repeats[0][0].should.equal('MSH');
        });
    });
});
