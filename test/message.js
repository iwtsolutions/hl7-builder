/*jshint expr: true*/
require('should');
var Segment = require('../builders/segment');
var Message = require('../builders/message');

describe('Message', function() {
    describe('new', function() {
        it('should error when no options object is given', function () {
            (function() {
                new Message();
            }).should.throw();

            (function() {
                new Message('');
            }).should.throw();
        });

        it('should error without a message type', function () {
            (function() {
                new Message({});
            }).should.throw();
        });

        it('should error without a message event', function() {
            (function() {
                new Message({ messageType: 'ADT' });
            }).should.throw();
        });

        it('should contain an MSH segment by default', function() {
            var message = new Message({ messageType: 'ADT', messageEvent: 'A01' });
            message.segments.length.should.equal(1);
            message.segments[0].fields[0].repeats[0][0].should.equal('MSH');
        });

        it('should have a valid date time in yyyyMMddHHmmss format', function () {
            var message = new Message({ messageType: 'ADT', messageEvent: 'A01' });
            var d = new Date();
            var date = d.getFullYear() + 
                ('0' + (d.getMonth() + 1)).slice(-2) +
                ('0' + d.getDate()).slice(-2);

            message.segments[0].fields[6].repeats[0][0].should.startWith(date);
        });
    });

    describe('toString()', function() {
        it('should return only a message header by default', function() {
            var message = new Message({ messageType: 'ADT', messageEvent: 'A01'});
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
                },
                messageType: 'ADT',
                messageEvent: 'A01'
            };
            var message = new Message(options);
            message.toString().should.startWith('MSH!@#$%!');
        });
    });

    describe('add(segment)', function() {
        it('should error when trying to add an MSH segment', function() {
            var message = new Message({ messageType: 'ADT', messageEvent: 'A01'});
            (function() {
                message.add(new Segment('MSH'));
            }).should.throw();
        });

        it('should error when a non object is passed into add(obj)', function() {
            var message = new Message({ messageType: 'ADT', messageEvent: 'A01'});
            (function() {
                message.add('test');
            }).should.throw();
        });

        it('should return three lines when two segments are added', function() {
            var message = new Message({ messageType: 'ADT', messageEvent: 'A01'});

            var segment = new Segment('EVN');
            message.add(segment);

            segment = new Segment('PID');
            message.add(segment);

            // MSH, EVN, PID
            message.toString().split('\r').length.should.equal(3);
        });

        it('should add multiple segments of the same name', function() {
            var message = new Message({ messageType: 'ADT', messageEvent: 'A01'});

            var segment = new Segment('EVN');
            message.add(segment);
            message.add(segment);
            message.add(segment);
            message.segments.length.should.equal(4);
        });
    });
});
