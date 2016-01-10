var BaseView = require('../../base-view');
var pageShowScreen = require('./component');

var pagesView = {
  component: function () {
    var pagesC = require('./pages/collection');
    var pages = new pagesC().fetch({
        complete: function(e) {
            React.render(<pagesIndexScreen pages={eval(e.responseText)} />, document.getElementById('container'));
        }
    });
  }
};

module.exports = pagesView;