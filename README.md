HL7-Builder
===========

This is a simple HL7 builder.

Usage
===========

    var Builder = require('./app');

    var message = new Builder.Message({
        messageType: 'ADT',
        messageEvent: 'A03',
        delimiters: {
            segment: '\n'
        }
    });

    var pid = new Builder.Segment('PID');
    pid.update(3, '234234');
    pid.update(18, '55555');

    message.add(pid);

    console.log(message.toString());
