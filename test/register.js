var mongoman = require(process.cwd());


var dbHost = 'mongodb://localhost/database'
db = mongoose.connect(dbHost);

mongoman.register('account', {
  email      : mongoman('Email').string().required().unique().matches(regexSet.email).fin(),
  password   : mongoman('Password').string().required().fin(),
  nickname   : mongoman('Nickname').string().required().unique().alphanum().isLength([3, 50]).fin(), // display name
  registered : mongoman().date().required().default(Date.now).fin(),
}

describe('SchemaType', function() {

  it('test', function() {

  });
});