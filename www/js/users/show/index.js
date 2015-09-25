var BaseView = require('../../base-view');
var UserShowScreen = require('./component');

var UsersView = {
  component: function () {
    var UsersC = require('./users/collection');
    var Users = new UsersC().fetch({
        complete: function(e) {
            React.render(<UsersIndexScreen users={eval(e.responseText)} />, document.getElementById('container'));
        }
    });
  }
};

module.exports = UsersView;