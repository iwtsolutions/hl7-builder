var should = require('should');
var Field  = require('../builders/field');

describe('Field', function () {
    describe('update(location, data)', function () {
        it('should add 3 empty components and a 4th field in one with add(4, "test"', function () {
            var field = new Field();
            field.update(4, 'test'); // Ex: ^^^^test

            field.repeats[0].length.should.equal(5);
            field.repeats[0][4].should.equal('test');
        });

        it('should update a 3rd component after adding 5', function () {
            var field = new Field();
            field.update(5);
            field.update(3, 'foo'); // Ex: ^^^foo^^

            field.repeats[0][3].should.equal('foo');
        });
    });

    describe('repeat()', function () {
        it('should create a repeated field with the same length of components.', function () {
            var field = new Field();
            field.update(5);
            field.update(3, 'foo');

            field.repeat();
            field.repeatIndex.should.equal(1);
            field.repeats.length.should.equal(2);
            field.repeats[1].length.should.equal(6);
            field.repeats[0][3].should.equal('foo');
            field.repeats[1][3].should.equal('');
        });
    });

    describe('get()', function () {
        it('should get a field by an index', function () {
            var field = new Field();
            field.update(5);
            field.update(3, 'foo');

            field.get(5).should.equal('');
            field.get(3).should.equal('foo');
        });

        it('should get a component in a repeated field by an index and default repeat', function () {
            var field = new Field();
            field.update(5);
            field.update(3, 'foo');

            field.repeat();
            field.update(5, 'foo');

            field.get(3).should.equal('');
            field.get(5).should.equal('foo');
        });

        it('should get a component in a repeated field by an index and repeat', function () {
            var field = new Field();
            field.update(5);
            field.update(3, 'bar2');

            field.repeat();
            field.update(5, 'foo');

            field.get(3, 0).should.equal('bar2');
            field.get(3, 1).should.equal('');
            field.get(5, 0).should.equal('');
            field.get(5, 1).should.equal('foo');
        });

        it('should return null if an index is invalid', function () {
            var field = new Field();
            should.not.exist(field.get(0));
            should.not.exist(field.get(18));
        });
    });

    describe('toString()', function () {
        it('should print out a field as a string', function () {
            var field = new Field();
            field.update(3, 'test');
            field.update(5, '5rd');
            field.toString().should.equal('^^^test^^5rd');
        });

        it('should print out a field with repeats as a string', function () {
            var field = new Field();
            field.update(0, 'holiday');
            field.update(2, 'christmas');

            field.repeat();
            field.update(0, 'holiday');
            field.update(2, '4st of july');
            field.toString().should.equal('holiday^^christmas~holiday^^4st of july');
        });

        it('should print out a field with repeats as a string with different delimiters', function () {
            var field = new Field();
            field.update(0, 'day');
            field.update(2, '17');

            field.repeat();
            field.update(0, 'day');
            field.update(2, '21');
            field.toString('!', ':').should.equal('day::17!day::21');
        });
    });
});
