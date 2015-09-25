/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
module.exports =  React.createClass({
    displayName: "Element",
    render: function () {
        return <div className="list-item-container">
            <a href={'http://www.youtube.com/watch?v=' + this.props.movie.youtube_id}>
                <img src={'http://img.youtube.com/vi/' + this.props.movie.youtube_id + '/mqdefault.jpg'} alt=""/>
                <h3>{this.props.movie.name}</h3>
            </a>
        </div>;
    }
});