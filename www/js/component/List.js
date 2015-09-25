/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
module.exports =  React.createClass({
    render: function () {
        var Element = require('./Element');
        return (<div>
            {this.props.movies.map(function(movie){
                return <Element key={movie.id} movie={movie} />
            })}
        </div>);
    }
})
