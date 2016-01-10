/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
//var NodeJSX = require('node-jsx').install({ extension: '.js', harmony: true });

var PageBlock = React.createBackboneClass({
  render: function () {
    var page = this.props.page;
    return (
        <a target="_blank" href={page.url} key={page.name} className="page-link" title={page.description}>
          {page.name}
        </a>
    );
  }
});

module.exports = PageBlock;
