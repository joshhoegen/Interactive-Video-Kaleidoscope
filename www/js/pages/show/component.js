/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
//var NodeJSX = require('node-jsx').install({ extension: '.js', harmony: true });

var User = require('../collection');

Backbone.emulateHTTP = true;

var pageShowScreen = React.createBackboneClass({
  mixins: [
     React.BackboneMixin('user', 'change'),
  ],

  getInitialState: function() {
    return {
      liked: false
    }
  },
  componentDidMount: function() {
    /*var user = new User();
    var re = this;
    //pagess = pagess.fetch();
    //console.log(pagess);
    user.fetch({
      complete: function(e) {
        //console.log(e.responseText);
        re.props.pages = eval(e.responseText);
        console.log(typeof(re.props.pages));
        // Shouldn't have to do this with mixins defined.
        // When props is updated, it should update view accordingly.
        re.forceUpdate();
      }
    });*/
  },

  handleLike: function(e) {
    e.preventDefault();
    var currentLikes = parseInt(this.props.user.attributes.likeCount);
    console.log(currentLikes);
    this.props.user.save({ likeCount: currentLikes + 1 });
  },

  render: function() {
    var user = this.props.user.attributes;
    //console.log(user.get(3));
    var username = user.username;
    var avatar = user.avatar;
    var likeCount = parseInt(user.likeCount);

    console.log(this.props);

    return (
      <div className="user-container">
        <h2>pages Show</h2>
        <h3>{username}s Profile</h3>
        <img src={avatar} alt={username} />
        <p>{likeCount} likes</p>
        <button className="like-button" onClick={this.handleLike}>
          Like
        </button>
      </div>
    );
  }
});

module.exports = pageShowScreen;
