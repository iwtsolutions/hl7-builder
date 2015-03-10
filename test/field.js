require('should');
var Field = require('../builders/field');

describe('Field', function() {
    describe('update(location, data)', function() {
        it('should add 3 empty components and a 4th field in one with add(4, "test"', function () {
            var field = new Field();
            field.update(4, 'test'); // Ex: ^^^^test 

            field.repeats[0].length.should.equal(5);
            field.repeats[0][4].should.equal('test');
        });

        it('should update a 3rd component after adding 5', function() {
            var field = new Field();
            field.update(5);
            field.update(3, 'foo'); // Ex: ^^^foo^^

            field.repeats[0][3].should.equal('foo');
        });
    });

    describe('repeat()', function() {
        it('should create a repeated field with the same length of components.', function() {
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
});
