import React, { PureComponent, Fragment } from 'react';
import {
    FacebookShareButton,
    TwitterShareButton,
    TelegramShareButton,
    GooglePlusShareButton,
    LinkedinShareButton,
    RedditShareButton,

    FacebookIcon,
    TwitterIcon,
    TelegramIcon,
    GooglePlusIcon,
    LinkedinIcon,
    RedditIcon
} from 'react-share';

class Share extends PureComponent {
    url = 'https://simulation.stableunit.org';
    title = 'Stableunit simulation';
    size = 32;
    round = true;

    render() {
        return (
            <Fragment>
                <FacebookShareButton url={this.url} quote={this.title}>
                    <FacebookIcon size={this.size} round={this.round} />
                </FacebookShareButton>
                <TwitterShareButton url={this.url} quote={this.title}>
                    <TwitterIcon size={this.size} round={this.round} />
                </TwitterShareButton>
                <TelegramShareButton url={this.url} quote={this.title}>
                    <TelegramIcon size={this.size} round={this.round} />
                </TelegramShareButton>
                <GooglePlusShareButton url={this.url} quote={this.title}>
                    <GooglePlusIcon size={this.size} round={this.round} />
                </GooglePlusShareButton>
                <LinkedinShareButton url={this.url} quote={this.title}>
                    <LinkedinIcon size={this.size} round={this.round} />
                </LinkedinShareButton>
                <RedditShareButton url={this.url} quote={this.title}>
                    <RedditIcon size={this.size} round={this.round} />
                </RedditShareButton>
            </Fragment>
        );
    }
}

export default Share;