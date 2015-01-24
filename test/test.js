var mon    = require(process.cwd());
var bcrypt = require('bcrypt-nodejs');
var mocha  = require('mocha');
var chai   = require('chai');
var db     = mon.connect();
var expect = chai.expect;


/////////////////////////////////////////////////////////////////////////////////
//
// Test prep
//
/////////////////////////////////////////////////////////////////////////////////

function toString (obj) {
  return JSON.stringify(obj, null, '  ');
}

function findValue (obj, namespace) {
  if (!obj) { return undefined; }

  var keys = namespace.split('.').reverse();
  while (keys.length && (obj = obj[keys.pop()]) !== undefined) {}

  return (typeof obj !== 'undefined' ? obj : undefined);
}

/////////////////////////////////////////////////////////////////////////////////
//
// Property builder
//
/////////////////////////////////////////////////////////////////////////////////


describe('Property Builder', function () {


  //
  // Universal
  //


  describe('Universal Attributes', function () {

    //
    // Required
    //
    describe('Required', function () {
      var val = 'foo';
      var modelName = 'requiredModel';

      mon.register(modelName, {
        prop : mon().required().string().fin()
      });

      // pass
      it('should accept any value', function (done) {
        var model = mon.new(modelName, { prop : val });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          expect(findValue(result, 'prop')).to.equal(val);
          done();
        });
      });

      // fail
      it('should reject empty values', function (done) {
        var model = mon.new(modelName);
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.type')).to.be.equal('required');
          done();
        });
      });
    }); // END - required

    //
    // Default
    //
    describe('Default', function () {
      var defaultStr = 'default string';
      var modelName = 'defaultModel';

      mon.register(modelName, {
        prop : mon().default(defaultStr).string().fin()
      });

      it('should set prop to `' + defaultStr + '`', function (done) {
        var model = mon.new(modelName);

        model.save(function (error, result) {
          expect(error).to.equal(null);
          expect(findValue(result, 'prop')).to.equal(defaultStr);
          done();
        });
      });
    }); // END - default

    //
    // Enum
    //
    describe('Enum', function () {
      var badVal   = 'example'
      var goodVal  = 'foo'
      var enumVals = [goodVal, 'bar']
      var modelName = 'enumModel';

      mon.register(modelName, {
        prop : mon().enum(enumVals).string().fin()
      });

      // pass
      it('should accept any one of `[' + enumVals + ']`', function (done) {
        var model = mon.new(modelName, { prop : goodVal });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          expect(findValue(result, 'prop')).to.equal(goodVal);
          done();
        });
      });

      // fail
      it('should reject `' + badVal + '`', function (done) {
        var model = mon.new(modelName, { prop : badVal });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.type')).to.be.equal('enum');
          done();
        });
      });
    });// END - enum

    //
    // Min
    //
    describe('Min', function () {
      var modelName = 'minModel';
      var oldDate   = new Date(5);

      mon.register(modelName, {
        str  : mon().string().min(5).fin(),
        arr  : mon().array().min(3).fin(),
        num  : mon().number().min(5).fin(),
        date : mon().date().min(new Date).fin(),
        obj  : mon().mixed().min(3).fin(),
        buf  : mon().buffer().min(5).fin()
      });

      // pass
      it('should accept long strings, arrays, numbers, dates, objects, and buffers', function (done) {
        var model = mon.new(modelName, {
          str  : 'five+',
          arr  : ['one', 'two', 'three'],
          num  : 10,
          date : new Date(),
          obj  : { one : '1', two : '2', three : '3' },
          buf  : new Buffer(5)
        });

        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject short strings, arrays, numbers, dates, objects, and buffers', function (done) {
        var model = mon.new(modelName, {
          str  : 'four',
          arr  : ['one', 'two'],
          num  : 4,
          date : oldDate,
          obj  : { one : '1', two : '2'},
          buf  : new Buffer(2)
        });

        model.save(function (error, result) {
          var msg = 'must be at least';
          expect(findValue(error, 'errors.str.message')).to.contain(msg);
          expect(findValue(error, 'errors.arr.message')).to.contain(msg);
          expect(findValue(error, 'errors.num.message')).to.contain(msg);
          expect(findValue(error, 'errors.date.message')).to.contain(msg);
          expect(findValue(error, 'errors.obj.message')).to.contain(msg);
          expect(findValue(error, 'errors.buf.message')).to.contain(msg);
          done();
        });
      });
    }); // END - Min

    //
    // Max
    //
    describe('Max', function () {
      var modelName = 'maxModel';
      var oldDate   = new Date(5);

      mon.register(modelName, {
        str  : mon().string().max(5).fin(),
        arr  : mon().array().max(3).fin(),
        num  : mon().number().max(5).fin(),
        date : mon().date().max(new Date(10)).fin(),
        obj  : mon().mixed().max(3).fin(),
        buf  : mon().buffer().max(5).fin()
      });

      // pass
      it('should accept long strings, arrays, numbers, dates, objects, and buffers', function (done) {
        var model = mon.new(modelName, {
          str  : 'five',
          arr  : ['one', 'two', 'three'],
          num  : 5,
          date : oldDate,
          obj  : { one : '1', two : '2', three : '3' },
          buf  : new Buffer(5)
        });

        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject short strings, arrays, numbers, dates, objects, and buffers', function (done) {
        var model = mon.new(modelName, {
          str  : 'sixsix',
          arr  : ['one', 'two', 'three', 'four'],
          num  : 6,
          date : new Date(),
          obj  : { one : '1', two : '2', three : '3', four : '4' },
          buf  : new Buffer(6)
        });

        model.save(function (error, result) {
          var msg = 'must be no more than';
          expect(findValue(error, 'errors.str.message')).to.contain(msg);
          expect(findValue(error, 'errors.arr.message')).to.contain(msg);
          expect(findValue(error, 'errors.num.message')).to.contain(msg);
          expect(findValue(error, 'errors.date.message')).to.contain(msg);
          expect(findValue(error, 'errors.obj.message')).to.contain(msg);
          expect(findValue(error, 'errors.buf.message')).to.contain(msg);
          done();
        });
      });
    }); // END - Max

    //
    // Length
    //
    describe('Length', function () {
      var modelName = 'lengthModel';
      var oldDate   = new Date(5);

      mon.register(modelName, {
        str  : mon().string().length(3).fin(),
        arr  : mon().array().length(3).fin(),
        obj  : mon().mixed().length(3).fin(),
        buf  : mon().buffer().length(3).fin()
      });

      // pass
      it('should accept exact length strings, arrays, objects, and buffers', function (done) {
        var model = mon.new(modelName, {
          str  : 'thr',
          arr  : ['one', 'two', 'three'],
          obj  : { one : '1', two : '2', three : '3' },
          buf  : new Buffer(3)
        });

        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject short strings, arrays, objects, and buffers', function (done) {
        var model = mon.new(modelName, {
          str  : 'tw',
          arr  : ['one', 'two'],
          obj  : { one : '1', two : '2'},
          buf  : new Buffer(2)
        });

        model.save(function (error, result) {
          var msg = 'must be exactly';
          expect(findValue(error, 'errors.str.message')).to.contain(msg);
          expect(findValue(error, 'errors.arr.message')).to.contain(msg);
          expect(findValue(error, 'errors.obj.message')).to.contain(msg);
          expect(findValue(error, 'errors.buf.message')).to.contain(msg);
          done();
        });
      });

      // fail 2
      it('should reject long strings, arrays, objects, and buffers', function (done) {
        var model = mon.new(modelName, {
          str  : 'four',
          arr  : ['one', 'two', 'three', 'four'],
          obj  : { one : '1', two : '2', three : '3', four : '4' },
          buf  : new Buffer(4)
        });

        model.save(function (error, result) {
          var msg = 'must be exactly';
          expect(findValue(error, 'errors.str.message')).to.contain(msg);
          expect(findValue(error, 'errors.arr.message')).to.contain(msg);
          expect(findValue(error, 'errors.obj.message')).to.contain(msg);
          expect(findValue(error, 'errors.buf.message')).to.contain(msg);
          done();
        });
      });
    }); // END - Length






  }); // END - universal attributes






});