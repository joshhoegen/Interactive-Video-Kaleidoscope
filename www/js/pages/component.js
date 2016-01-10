/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var PageLink = require('./page-link');

var pagesIndexScreen = React.createBackboneClass({
  render: function() {
    var pages = this.props.pages;
    var re = this;
      pageHtml = this.props.pages.map(function(page, i) {
        console.log(i);
        return <PageLink key={page.name} page={page} />
      });
    return (
      <div className="pages-container">
        Follow me on social media to see more art and code!
        <br/>{ pageHtml }
      </div>
    );
  }
});

module.exports = pagesIndexScreen;
