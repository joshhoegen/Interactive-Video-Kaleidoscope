/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');

var BaseView = Backbone.View.extend({
  initialize: function (options) {
    this.options = options || {};
  },

  component: function () {
    return(<div></div>);
  },

  render: function () {
    console.log(this.$el);
    return(<div></div>);
  }
});

module.exports = BaseView;