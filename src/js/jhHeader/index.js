import React from 'react';
import './assets/main.scss';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    //<a data-click="showMenu = !showMenu" className="menu-button data-scope">&#9776;</a>
    return (
      <div>
        <div className="jh-directions">
          <div className="jh-directions-text">
            Hover/tap over the top left and the bottom of the browser window for interactive controls and options.
          </div>
          {/* <img src={PixelImage} alt="null" /> */}
        </div>
        <div id="jh-header-ui">
          <div id="jh-header" className="data-scope">
            <div id="jh-nav" className="data-scope">
              <ul data-controller="pagesList" data-show="showMenu" className="pages data-scope">
                <li className="pages-listing data-scope">
                  <a href="http://instagram.com/joshhoegen"><i className="fa fa-instagram" /> Instagram<span>- Art and life in static images</span></a>
                </li>
                <li className="pages-listing data-scope">
                  <a href="https://byutifu.com/"><i className="fa fa-globe" /> Js + Video = Trails <span>- Interactive art</span></a>
                </li>
                <li className="pages-listing data-scope">
                  <a href="https://byutifu.com/kaleidoscope"><i className="fa fa-globe" /> Js + Video = Kaleidoscope <span>- Interactive art</span></a>
                </li>
                <li className="pages-listing data-scope">
                  <a href="http://github.com/joshhoegen"><i className="fa fa-github" /> Git<span>- Not as much stuff as I'd like, but it's there!</span></a>
                </li>
                <li className="pages-listing data-scope">
                  <a href="http://linkedin.com/pub/josh-hoegen/b/a9/9b8"><i className="fa fa-linkedin" /> LinkedIn<span>- Professional profile</span></a>
                </li>
                <li className="pages-listing data-scope">
                  <a href="http://soundcloud.com/byutifu"><i className="fa fa-soundcloud" /> Sound Cloud<span>- Remix of Jazz and other Retro Artists</span></a>
                </li>
                <li className="pages-listing data-scope">
                  <a href="http://flickr.com/photos/joshhoegen"><i className="fa fa-flickr" /> Flickr<span>- Visual Art</span></a>
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
      </div>
    );
  }
}
