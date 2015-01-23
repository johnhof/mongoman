var man    = require(process.cwd());
var bcrypt = require('bcrypt-nodejs');
var mocha  = require('mocha');
var chai   = require('chai');
var db     = man.connect();


/////////////////////////////////////////////////////////////////////////////////
//
// Array properties
//
/////////////////////////////////////////////////////////////////////////////////


describe('Validation', function () {

  // Array
  //
  describe('Array', function () {
    var ArrayModel =  man.register('ArrayModel', {
      // sparse
      allowSparse  : man('Sparse Prop').required().array().sparse(),
      rejectSparse : man('Reject Sparse Prop').required().array().sparse(false),
    });


    it('Should validate sparse', function (done) {
      var model = new ArrayModel();

      model.allowSparse  = ['I', undefined, 'should', undefined, 'pass'];
      model.rejectSparse = ['I', undefined, 'should', undefined, 'fail'];

      model.save(function (error, newFoo) {
        // if (error) throw error;
        console.log(arguments);

        done();
      });
    });
  });

  // String
  //
  describe('String', function () {
    var StringModel =  man.register('StringModel', {
      // lengths
      minStr : man('Min Prop').required().string().min(5),
      maxStr : man('Max Prop').required().string().max(10),
      lenStr : man('Len Prop').required().string().length(3),
    });


    it('Should validate sparse', function (done) {
      var model = new StringModel();

      model.minStr = 4;
      model.maxStr = 11;
      model.lenStr = 4;

      model.save(function (error, newFoo) {
        // if (error) throw error;
        console.log(arguments);

        done();
      });
    });
  });



});