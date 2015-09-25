/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var UserBlock = require('./user-block');

var UsersIndexScreen = React.createBackboneClass({
  mixins: [
    React.BackboneMixin({
      propName: 'user',
      renderOn: 'change'
    })
  ],
  componentDidMount: function() {
    /*var userss = new Userss();
    var re = this;
    //userss = Userss.fetch();
    //console.log(userss);
    userss.fetch({
      complete: function(e) {
        //console.log(e.responseText);
        re.props.users = eval(e.responseText);
        console.log(typeof(re.props.users));
        // Shouldn't have to do this with mixins defined.
        // When props is updated, it should update view accordingly.
        re.forceUpdate();
      }
    });*/
  },
  render: function() {
    var users = this.props.users;
    console.log(users);
    var re = this;
      //console.log(users);
      //console.log(typeof(this.props.users));
      userBlocks = this.props.users.map(function(user, i) {
        console.log(i);
        return <UserBlock key={user.id} user={user} />
      });
      //userBlocks = React.cloneElement(userBlocks, this.props.users);
      
    console.log(userBlocks);

    return (
      <div className="users-container">
        <h2>Users Indrex</h2>
        <h3>Users</h3>
        {userBlocks}
      </div>
    );
  }
});

module.exports = UsersIndexScreen;