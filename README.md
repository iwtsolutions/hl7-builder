HL7-Builder
===========

[![Build Status](https://travis-ci.org/iwtsolutions/hl7-builder.svg?branch=master)](https://travis-ci.org/iwtsolutions/hl7-builder)
[![Coverage Status](https://coveralls.io/repos/github/iwtsolutions/hl7-builder/badge.svg?branch=master)](https://coveralls.io/github/iwtsolutions/hl7-builder?branch=master)

This is a simple HL7 builder.

Usage
===========

    var Builder = require('./app');

    // Set various options. Type & Event are required.
    var message = new Builder.Message({
        messageType: 'ADT',     // Required
        messageEvent: 'A03',    // Required
        eventSegment: true,
        delimiters: {
            segment: '\n'
            // field, component, repeat, escape, subComponent (unused)
        },
        sendingApplication: 'Builder',
        sendingFacility: 'UnitA',
        receivingApplication: 'Consumer',
        receivingFacility: 'UnitB',
        messageId: Math.floor((Math.random() * 1000) + 1),
        version: '2.3'          // Default: 2.3
    });

    // Create a new segment
    var pid = new Builder.Segment('PID');

    // Add fields with a single component
    pid.update(3, '234234');
    pid.update(18, '55555');

    // Construct a field with multiple components
    var address = new Builder.Field();
    address.update(0, '0000 main street');
    address.update(2, 'Last Vegas');
    address.update(3, 'NV');
    address.update(4, '12345');

    // Add a repeat inside a field
    address.repeat();
    address.update(0, '1111 alternate street');
    address.update(2, 'Last Vegas');
    address.update(3, 'NV');
    address.update(4, '12345');

    pid.update(11, address);

    // Append segments to the message
    message.add(pid);

    console.log(message.toString());

    // Create an L7 query object (see L7 documentation)
    message = message.toQuery();

    console.log(message.query('PID|3'));
