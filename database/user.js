const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  session: String,
  history: Array,
});
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

User.findOrCreate = function findCreate(info, cb) {
  User.findOne({username: info.twitterId}, (err, user) => {
    if (err) return cb(err, null);
    if (!user) {
      const newUser = new User({
        username: info.twitterId,
        session: '',
        history: [],
      });
      return newUser.save(error => {
        if (err) return cb(error, null);
        return cb(null, newUser);
      });
    }
    return cb(null, user);
  });
};

User.sessionAdd = function(username, session) {
  User.findOne({username}, (err, user) => {
    if (err) return console.log(err);
    user.session = session;
    user.save(err => {
      if (err) console.error(err);
    });
  });
};

User.sessionCheck = function(session) {
  return new Promise((res, rej) => {
    User.findOne({session}, (err, user) => {
      if (err) rej(err);
      res(user);
    });
  });
};

User.historyAdd = function(session, term){
  return new Promise((res, rej) => {
    User.findOne({session}, (err, user) => {
      if(err || !user) rej(err);
      console.log(user);
      user.history.unshift(term);
      user.save(err => console.error(err))
      res('done');
    })
  })
}

module.exports = User;
