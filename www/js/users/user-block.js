/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
//var NodeJSX = require('node-jsx').install({ extension: '.js', harmony: true });

var UserBlock = React.createBackboneClass({
  render: function () {
    var user = this.props.user;
    var username = user.username;
    var avatar = user.avatar;
    var link = '#users/' + user.id;
    
    return (
      <div key={user.id} className="user-block">
        <a href={link}>
          <h2>{username}</h2>
          <img height="200" width="200" src={avatar} alt={username} />
        </a>
      </div>
    );
  }
});

module.exports = UserBlock;