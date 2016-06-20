HL7-Builder
===========

[![Build Status](https://travis-ci.org/iwtsolutions/hl7-builder.svg?branch=master)](https://travis-ci.org/iwtsolutions/hl7-builder)
[![Coverage Status](https://coveralls.io/repos/github/iwtsolutions/hl7-builder/badge.svg?branch=master)](https://coveralls.io/github/iwtsolutions/hl7-builder?branch=master)

This is a simple HL7 builder.

## Setup

* `npm install`
* `npm install -g grunt-cli`

## Usage

    var Builder = require('./app');

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

    var pid = new Builder.Segment('PID');

    // Add fields with a single component
    pid.set(3, '234234');
    pid.set(18, '55555');

    // Add field with multiple components
    var address = new Builder.Field();
    address.set(0, '0000 main street');
    address.set(2, 'Last Vegas');
    address.set(3, 'NV');
    address.set(4, '12345');

    // Add a repeat inside a field
    address.repeat();
    address.set(0, '1111 alternate street');
    address.set(2, 'Last Vegas');
    address.set(3, 'NV');
    address.set(4, '12345');

    pid.set(11, address);

    var pv1 = new Builder.Segment('PV1');
    pv1.set(1, 'Testable');

    message.add(pid);
    message.add(pv1);

    // Getters
    console.log(address.get(0));        // 1111 alternative street
    console.log(address.get(0, 0));     // 1234 main street
    console.log(pid.get(3));            // 234234

    // toStrings
    console.log(address.toString());    // 0000 main street^Last Vegas^NV^12345~1111 alternate street^Last Vegas^NV^12345
    console.log(pv1.toString());        // PV1|Testable
    console.log(message.toString());    // MSH|.....

    // Create an L7 query object
    var parsedMessage = message.toQuery();
    console.log(parsedMessage.query('PID|3'));


## Testing
* `grunt` - Runs eslint & mocha tests
* `grunt lint` - Runs eslint only
* `grunt test` - Runs mocha tests only


## API

### Builder.Message(options)

Creates a new HL7 builder. `options` are required and define the MSH header.

###### `options`

* `messageType` (string) - [3 Character event type](http://www.hosinc.com/products/interfaces/interface_documentation.htm#Message type)
* `messageEvent` (string) -  [3 Character trigger event](http://www.hosinc.com/products/interfaces/interface_documentation.htm#Message type)
* `eventSegment` (boolean?) - If true, automatically adds an [event segment](http://www.hosinc.com/products/interfaces/interface_documentation.htm#EVN)
* `delimieters` (object?) - [Delimiters](https://healthstandards.com/blog/2007/09/24/hl7-separator-characters/) used to separate parts. Defaults:
    * `segment` - `\n`
    * `field` - `|`
    * `component` - `^`
    * `repeat` - `~`
    * `escape` - `\`
    * `subComponent` - `&`
* `sendingApplication` - App that sent the message
* `sendingFacility` - Facility that sent the message
* `receivingApplication` - App that should receive the message
* `receivingFacility` - Facility that should receive the message
* `messageId` - Unique message identifier. default: `Math.floor((Math.random() * 1000) + 1)`
* `version` - HL7 version, Default: `2.3`

### Builder.Segment(segmentName)

Creates a new HL7 segment builder with a required 3 character `segmentName` identifier. Examples: MSH, PID, PV1, OBR, OBX.

##### set(location, field)

Sets a field at `location` (number) to the value of `field` (string or instance of Builder.Field).

##### get(index [,repeatDelimiter[,componentDelimiter[,subComponentDelimiter]]])

Gets a field at `index` (number) with optional delimiters.

##### getName()

Returns the segment name.

##### toString(delimiters)

Returns the segment as a string with optional `delimiters`.

### Builder.Field(length)

Creates a new HL7 field builder with an optional `length`.

##### set(location, data)

Sets a component at `location` (number) with `data` (string).

##### get(index [,repeat])

Gets a component at `index` (number) for the repeated field `repeat`. If `repeat` is not defined, it will use the last `repeat` specified.

##### repeat()

Adds a new field in the same position (repeated). Use `set` for adding new data to this repeated field.

##### toString([,repeatDelimiter[,componentDelimiter[,subComponentDelimiter]]])

Returns the field as a string with optional delimiters.

## License

[MIT](https://github.com/iwtsolutions/hl7-builder/blob/master/LICENSE)
