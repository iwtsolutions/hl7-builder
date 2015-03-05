var Message = require('../message');
var Segment = require('../message');
var should = require('should');

describe('Message', function() {
    describe('toString()', function() {
        it('should return only a message header by default', function() {
            var message = new Message();
            message.toString().split('\r').length.should.equal(1);
            message.toString().should.not.be.empty;
        });

        it('should setup delimiters when passed in', function() {
            var options = {
                delimiters: {
                    field: '!',
                    component: '@',
                    repeat: '#',
                    escape: '$',
                    subComponent: '%'
                }
            };
            var message = new Message(options);
            message.toString().should.startWith('MSH!@#$%!');
        });

        it('should return three lines when two segments are added');
        it('should add multiple segments of the same name');
        it('should error when trying to add an MSH segment');
        it('should error without a message type');
        it('should error without a message event');
    });
});
