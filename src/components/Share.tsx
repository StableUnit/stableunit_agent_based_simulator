import React, { PureComponent, Fragment } from "react";
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, LinkedinShareButton, RedditShareButton, FacebookIcon, TwitterIcon, TelegramIcon, LinkedinIcon, RedditIcon } from "react-share";

class Share extends PureComponent {
  url = 'https://simulation.stableunit.org';
  title = 'Stableunit simulation';
  size = 32;
  round = true;

  render() {
    return <Fragment>
                <FacebookShareButton url={this.url} quote={this.title}>
                    <FacebookIcon size={this.size} round={this.round} />
                </FacebookShareButton>
                <TwitterShareButton url={this.url} title={this.title}>
                    <TwitterIcon size={this.size} round={this.round} />
                </TwitterShareButton>
                <TelegramShareButton url={this.url} title={this.title}>
                    <TelegramIcon size={this.size} round={this.round} />
                </TelegramShareButton>
                <LinkedinShareButton url={this.url} title={this.title}>
                    <LinkedinIcon size={this.size} round={this.round} />
                </LinkedinShareButton>
                <RedditShareButton url={this.url} title={this.title}>
                    <RedditIcon size={this.size} round={this.round} />
                </RedditShareButton>
            </Fragment>;
  }

}

export default Share;