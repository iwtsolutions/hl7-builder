var Message = require('../message');
var should = require('should');

describe('Message', function() {
    describe('toString()', function() {
        it('should return an empty string when nothing is added', function() {
            var message = new Message();
            message.toString().should.equal('');
        });

        it('should return three lines when three segments are added');
        it('should add multiple segments of the same name');
        it('should not add multiple MSH segments');
    });
});
