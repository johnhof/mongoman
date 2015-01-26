var mon    = require(process.cwd());
var mocha  = require('mocha');
var chai   = require('chai');
var db     = mon.connect();
var expect = chai.expect;

/////////////////////////////////////////////////////////////////////////////////
//
// Test prep
//
/////////////////////////////////////////////////////////////////////////////////

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
 before(function (done){
    mon.drop('db');
    done();
  });


  //
  // Shared attributes
  //


  describe('Shared Attributes', function () {

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
  }); // END - Shared attributes



  //
  // Array attributes
  //



  describe('Array Attributes', function () {

    //
    // Sparse
    //
    describe('Sparse', function () {
      var notSparse = ['foo', 'bar'];
      var isSparse  = ['foo', undefined, 'bar'];
      var modelName = 'sparseModel';

      mon.register(modelName, {
        prop : mon().sparse().array().fin()
      });

      // pass
      it('should allow non-sparse arrays', function (done) {
        var model = mon.new(modelName, { prop : notSparse });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject sparse arrays', function (done) {
        var model = mon.new(modelName, { prop : isSparse });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('undefined values not allowed');
          done();
        });
      });
    }); // END - sparse
  }); // END - array


  //
  // String attributes
  //


  describe('String Attributes', function () {

    //
    // Alpha numeric
    //
    describe('Alpha Numeric', function () {
      var alpha    = 'asdf1234';
      var nonAlpha = 'asdf1234-`=.,;`';
      var modelName = 'alphanumModel';

      mon.register(modelName, {
        prop : mon().alphanum().string().fin()
      });

      // pass
      it('should allow alpha numberic strings', function (done) {
        var model = mon.new(modelName, { prop : alpha });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject non alphanumeric strings', function (done) {
        var model = mon.new(modelName, { prop : nonAlpha });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('alpha-numeric characters only');
          done();
        });
      });
    }); // END - alphanumeric

    //
    // Regex
    //
    describe('Regex', function () {
      var passes    = '1243-asdASD';
      var fails     = '-asdASD';
      var regex     = /\d+-[a-zA-Z]+/;
      var modelName = 'regexModel';

      mon.register(modelName, {
        prop : mon().regex(regex).string().fin()
      });

      // pass
      it('should match ' + passes + ' against ' + regex, function (done) {
        var model = mon.new(modelName, { prop : passes });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject ' + fails + ' against ' + regex, function (done) {
        var model = mon.new(modelName, { prop : fails });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('invalid');
          done();
        });
      });
    }); // END - regex

    //
    // Email
    //
    describe('Email', function () {
      var passes    = 'myself@succeed.com';
      var fails     = 'myself@fail'
      var modelName = 'emailModel';

      mon.register(modelName, {
        prop : mon().email().string().fin()
      });

      // pass
      it('should allow valid email address', function (done) {
        var model = mon.new(modelName, { prop : passes });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject invalid email address', function (done) {
        var model = mon.new(modelName, { prop : fails });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('valid email');
          done();
        });
      });
    }); // END - email

    //
    // Token
    //
    describe('Token', function () {
      var passes    = 'asdaf-asdf-asdf-asdf';
      var fails     = 'asdf+asdf+asdf';
      var modelName = 'tokenModel';

      mon.register(modelName, {
        prop : mon().token().string().fin()
      });

      // pass
      it('should allow valid token', function (done) {
        var model = mon.new(modelName, { prop : passes });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject invalid token', function (done) {
        var model = mon.new(modelName, { prop : fails });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('valid token');
          done();
        });
      });
    }); // END - token

    //
    // GUID
    //
    describe('GUID', function () {
      var passes    = 'e0e4ba57-9d1b-4838-a310-b91fb2f5b295';
      var fails     = '12345678-1234567890AB';
      var modelName = 'guidModel';

      mon.register(modelName, {
        prop : mon().guid().string().fin()
      });

      // pass
      it('should allow valid GUID', function (done) {
        var model = mon.new(modelName, { prop : passes });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject invalid GUID', function (done) {
        var model = mon.new(modelName, { prop : fails });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('valid GUID');
          done();
        });
      });
    }); // END - guid

    //
    // Host name
    //
    describe('Host Name', function () {
      var passes    = 'my.host.com';
      var fails     = 'notvalid?asdf#asd';
      var modelName = 'hostModel';

      mon.register(modelName, {
        prop : mon().hostname().string().fin()
      });

      // pass
      it('should allow valid host name', function (done) {
        var model = mon.new(modelName, { prop : passes });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject invalid host name', function (done) {
        var model = mon.new(modelName, { prop : fails });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('valid host name');
          done();
        });
      });
    }); // END - hostname

    //
    // Uppercase
    //
    describe('Uppercase', function () {
      var passes    = 'UPPER';
      var fails     = 'lower';
      var modelName = 'upperModel';

      mon.register(modelName, {
        prop : mon().uppercase().string().fin()
      });

      // pass
      it('should allow uppercase string', function (done) {
        var model = mon.new(modelName, { prop : passes });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject lowercase string', function (done) {
        var model = mon.new(modelName, { prop : fails });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('must be upper case');
          done();
        });
      });
    }); // END - uppercase

    //
    // Lowercase
    //
    describe('Lowercase', function () {
      var passes    = 'lower';
      var fails     = 'Upper';
      var modelName = 'lowerModel';

      mon.register(modelName, {
        prop : mon().lowercase().string().fin()
      });

      // pass
      it('should allow lowercase string', function (done) {
        var model = mon.new(modelName, { prop : passes });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject uppercase string', function (done) {
        var model = mon.new(modelName, { prop : fails });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('must be lower case');
          done();
        });
      });
    }); // END - lowercase
  }); // END - string


  //
  // Number attributes
  //


  describe('Number Attributes', function () {

    //
    // Greater
    //
    describe('Greater', function () {
      var passes    = 10;
      var fails     = 5;
      var breakPt   = 7
      var modelName = 'greaterModel';

      mon.register(modelName, {
        prop : mon().number().greater(breakPt).fin()
      });

      // pass
      it('should allow number greater than ' + breakPt, function (done) {
        var model = mon.new(modelName, { prop : passes });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject number less than or equal to ' + breakPt, function (done) {
        var model = mon.new(modelName, { prop : fails });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('must be greater than');
          done();
        });
      });
    }); // END - greater

    //
    // Less
    //
    describe('Less', function () {
      var passes    = 5;
      var fails     = 10;
      var breakPt   = 7
      var modelName = 'lessModel';

      mon.register(modelName, {
        prop : mon().number().less(breakPt).fin()
      });

      // pass
      it('should allow number less than ' + breakPt, function (done) {
        var model = mon.new(modelName, { prop : passes });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject number greater than or equal to ' + breakPt, function (done) {
        var model = mon.new(modelName, { prop : fails });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('must be less than');
          done();
        });
      });
    }); // END - greater

    //
    // Integer
    //
    describe('Integer', function () {
      var passes    = 5;
      var fails     = 5.555;
      var modelName = 'intModel';

      mon.register(modelName, {
        prop : mon().number().integer().fin()
      });

      // pass
      it('should allow integers', function (done) {
        var model = mon.new(modelName, { prop : passes });
        model.save(function (error, result) {
          expect(error).to.equal(null);
          done();
        });
      });

      // fail
      it('should reject floating point numbers', function (done) {
        var model = mon.new(modelName, { prop : fails });
        model.save(function (error, result) {
          expect(findValue(error, 'errors.prop.message')).to.contain('must be an integer');
          done();
        });
      });
    }); // END - integer
  }); // END - number
});// END - validation