var mon    = require(process.cwd());
var bcrypt = require('bcrypt-nodejs');
var mocha  = require('mocha');
var chai   = require('chai');
var expect = chai.expect;
var async  = require('async');

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
// Utilities
//
/////////////////////////////////////////////////////////////////////////////////

describe('utilities', function () {
  var johnsSecret = 'johns secret';

  before(function (done){
    mon.drop('db');

    mon.register('Person', {
      firstName : mon().string().required().fin(),
      lastName  : mon().string().required().fin(),
      secret    : mon().string().fin()
    }, {
      middleware : {
        pre : {
          save : function (callback) {
            if (this.isModified('secret'))  {
              this.secret = bcrypt.hashSync(this.secret, bcrypt.genSaltSync());
            }

            return callback();
          }
        }
      },
      methods : {
        findFamily : function (callback) {
          return mon.model('Person').find({
            lastName : this.lastName
          }, callback);
        },
        compareSecret : function(submitted, callback) {
          var result = bcrypt.compareSync(submitted, this.secret);
          return callback(null, result);
        }
      },
      statics : {
        findByFirst : function (first, callback) {
          return mon.model('Person').find({
            firstName : first
          }, callback);
        }
      },
      virtuals : {
        fullName : {
          get : function () {
            return this.firstName + ' ' + this.lastName;
          }
        }
      }
    });

    async.series([
      function save (callback) {
        mon.new('Person', { firstName : 'andy',  lastName : 'smith', secret : 'andys secret' }).save(callback);
      },
      function save (callback) {
        mon.new('Person', { firstName : 'dan',  lastName : 'testington', secret : 'dans secret' }).save(callback);
      },
      function save (callback) {
        mon.new('Person', { firstName : 'juno',  lastName : 'dandy', secret : 'junos secret' }).save(callback);
      },
      function save (callback) {
        mon.new('Person', { firstName : 'john',  lastName : 'johnson', secret : johnsSecret }).save(callback);
      },
    ], done);
  });


  //
  // Register
  //


  describe('Register', function () {

    //
    // Virtual
    //
    describe('Virtual', function () {
      it('should access virtual fullName', function (done) {
        mon.model('Person').findOne({ firstName : 'john' }, function (error, person) {
          expect(error).to.be.equal(null);
          expect(person.fullName).to.be.equal('john johnson');
          done();
        });
      });
    });


    //
    // Middleware
    //
    describe('Middleware', function () {
      it('should verify that the secrets were hashed', function (done) {
        mon.model('Person').findOne({ firstName : 'john' }, function (error, person) {
          expect(error).to.be.equal(null);
          person.compareSecret(johnsSecret, function (err, result) {
            expect(err).to.be.equal(null);
            expect(result).to.equal(true);
          });
          done();
        });
      });
    });


    //
    // Methods
    //
    describe('Method', function () {
      it('should call method `findFamily`', function (done) {
        var joe = mon.new('Person', { firstName : 'joe',  lastName : 'smith'});

        joe.findFamily(function (error, family) {
          expect(error).to.be.equal(null);
          expect(family).to.have.length(1);
          expect(family[0].firstName).to.be.equal('andy');
          done();
        });
      });
    });


    //
    // Statics
    //
    describe('Static', function () {
      it('should call static `findByFirst`', function (done) {
        mon.model('Person').findByFirst('john', function (error, family) {
          expect(error).to.be.equal(null);
          expect(family).to.have.length(1);
          expect(family[0].lastName).to.be.equal('johnson');
          done();
        });
      });
    });
  });
});

