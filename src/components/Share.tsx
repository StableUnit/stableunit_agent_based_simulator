import React, { PureComponent } from "react";
import styled from "styled-components";
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, LinkedinShareButton, RedditShareButton, FacebookIcon, TwitterIcon, TelegramIcon, LinkedinIcon, RedditIcon } from "react-share";

const StyledIconContainer = styled.div`
  padding-right: 10px;
`;
class Share extends PureComponent {
  url = 'https://simulation.stableunit.org';
  title = 'Stableunit simulation';
  size = 32;
  round = true;

  render() {
    return <>
        <StyledIconContainer>
            <FacebookShareButton url={this.url} quote={this.title}>
                <FacebookIcon size={this.size} round={this.round} />
            </FacebookShareButton>
        </StyledIconContainer>

        <StyledIconContainer>
            <TwitterShareButton url={this.url} title={this.title}>
                <TwitterIcon size={this.size} round={this.round} />
            </TwitterShareButton>
        </StyledIconContainer>

        <StyledIconContainer>
            <TelegramShareButton url={this.url} title={this.title}>
                <TelegramIcon size={this.size} round={this.round} />
            </TelegramShareButton>
        </StyledIconContainer>

        <StyledIconContainer>
            <LinkedinShareButton url={this.url} title={this.title}>
                <LinkedinIcon size={this.size} round={this.round} />
            </LinkedinShareButton>
        </StyledIconContainer>

        <StyledIconContainer>
            <RedditShareButton url={this.url} title={this.title}>
                <RedditIcon size={this.size} round={this.round} />
            </RedditShareButton>
        </StyledIconContainer>
    </>;
  }
}

export default Share;