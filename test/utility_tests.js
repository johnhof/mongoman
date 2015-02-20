var Mon    = require(process.cwd());
var bcrypt = require('bcrypt-nodejs');
var mocha  = require('mocha');
var expect = require('chai').expect;
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

  before(function (done) {
    Mon.drop('db');

    Mon.register('Person', {
      firstName : Mon().string().required().fin(),
      lastName  : Mon().string().required().fin(),
      secret    : Mon().string().fin()
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
          return Mon.model('Person').find({
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
          return Mon.model('Person').find({
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
        Mon.new('Person', { firstName : 'andy',  lastName : 'smith', secret : 'andys secret' }).save(callback);
      },
      function save (callback) {
        Mon.new('Person', { firstName : 'dan',  lastName : 'testington', secret : 'dans secret' }).save(callback);
      },
      function save (callback) {
        Mon.new('Person', { firstName : 'juno',  lastName : 'dandy', secret : 'junos secret' }).save(callback);
      },
      function save (callback) {
        Mon.new('Person', { firstName : 'john',  lastName : 'johnson', secret : johnsSecret }).save(callback);
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
        Mon.model('Person').findOne({ firstName : 'john' }, function (error, person) {
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
        Mon.model('Person').findOne({ firstName : 'john' }, function (error, person) {
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
        var joe = Mon.new('Person', { firstName : 'joe',  lastName : 'smith'});

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
        Mon.model('Person').findByFirst('john', function (error, family) {
          expect(error).to.be.equal(null);
          expect(family).to.have.length(1);
          expect(family[0].lastName).to.be.equal('johnson');
          done();
        });
      });
    });
  });


  describe('InitModels', function () {
    beforeEach(function () {
      Mon.drop('db');
    });

    function model (model) {
      return function () { return Mon.model(model); }
    }

    //
    // Flat structure, no regex
    //
    describe('Flat Structure', function () {
      it('should register models `biz` and `buz` in flat directory', function () {
        Mon.registerAll(__dirname + '/models/flat');
        expect(Mon.model('biz')).to.be.a('function');
        expect(Mon.model('buz')).to.be.a('function');
      });
    });


    //
    // Tree structure, regex
    //
    describe('Tree Structure', function () {
      it('should register models `bar` and `baz` in directory tree matching regex `/_model/`', function () {
        Mon.registerAll(__dirname + '/models/tree', /_model/)
        expect(Mon.model('bar')).to.be.a('function');
        expect(Mon.model('baz')).to.be.a('function');
        expect(model('foo')).to.throw(/Schema hasn\'t been registered/);
      });
    });
  });
});

