var Mongoman = require(process.cwd());


var dbHost = 'mongodb://localhost/database'
db = mongoose.connect(dbHost);

Mongoman.register('account', {
  email      : Mongoman('Email').string().required().unique().matches(regexSet.email).fin(),
  password   : Mongoman('Password').string().required().fin(),
  nickname   : Mongoman('Nickname').string().required().unique().alphanum().isLength([3, 50]).fin(), // display name
  registered : Mongoman().date().required().default(Date.now).fin(),
}

describe('Register', function() {

  it('Should ai', function() {

  });

  it('', function() {


  it('', function() {


  it('', function() {


  it('', function() {


  it('', function() {


  it('', function() {

});