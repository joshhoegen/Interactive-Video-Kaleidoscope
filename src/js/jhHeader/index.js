import React from 'react';
import './assets/main.scss';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    //<a data-click="showMenu = !showMenu" className="menu-button data-scope">&#9776;</a>
    return (
      <div id="jh-header-ui">
        <div id="jh-header" className="data-scope">
          <div id="jh-nav" className="data-scope">
            <ul data-controller="pagesList" data-show="showMenu" className="pages data-scope">
              <li data-repeat="Page in pages.page | orderBy:orderProp" className="pages-listing data-scope">
                <a href="http://instagram.com/joshhoegen" target="_blank" className="data-binding"><i className="fa fa-instagram" /> Instagram<span className="data-binding">- Art and life in static images</span></a>
              </li>
              <li data-repeat="Page in pages.page | orderBy:orderProp" className="pages-listing data-scope">
                <a href="https://byutifu.com/trails/" target="_blank" className="data-binding"><i className="fa fa-globe" /> Js + Video = Trails <span className="data-binding">- Interactive art</span></a>
              </li>
              <li data-repeat="Page in pages.page | orderBy:orderProp" className="pages-listing data-scope">
                <a href="https://byutifu.com/" target="_blank" className="data-binding"><i className="fa fa-globe" /> Js + Video = Kaleidoscope <span className="data-binding">- Interactive art</span></a>
              </li>
              <li data-repeat="Page in pages.page | orderBy:orderProp" className="pages-listing data-scope">
                <a href="http://github.com/joshhoegen" target="_blank" className="data-binding"><i className="fa fa-github" /> Git<span className="data-binding">- Not as much stuff as I'd like, but it's there!</span></a>
              </li>
              <li data-repeat="Page in pages.page | orderBy:orderProp" className="pages-listing data-scope">
                <a href="http://linkedin.com/pub/josh-hoegen/b/a9/9b8" target="_blank" className="data-binding"><i className="fa fa-linkedin" /> LinkedIn<span className="data-binding">- Professional profile</span></a>
              </li>
              <li data-repeat="Page in pages.page | orderBy:orderProp" className="pages-listing data-scope">
                <a href="http://soundcloud.com/byutifu" target="_blank" className="data-binding"><i className="fa fa-soundcloud" /> Sound Cloud<span className="data-binding">- Remix of Jazz and other Retro Artists</span></a>
              </li>
              <li data-repeat="Page in pages.page | orderBy:orderProp" className="pages-listing data-scope">
                <a href="http://flickr.com/photos/joshhoegen" target="_blank" className="data-binding"><i className="fa fa-flickr" /> Flickr<span className="data-binding">- Visual Art</span></a>
              </li>
            </ul>
          </div>
          <h1 className="title">@joshhoegen</h1>
          <div className="directions" role="alert">
            {this.props.directions}
            {/* &nbsp;&#8592;&nbsp;
            Hover over the left corner to expose controls. Default color is green (2AB050).
            You can also choose color by appending "?hex=2AB050" in the address bar. */}
          </div>
        </div>
      </div>
    );
  }
}
