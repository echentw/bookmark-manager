import * as React from 'react';

import { Link } from '../Link';
import { LinksPaneComponent } from './LinksPaneComponent';

export interface AppState {
  links: Link[];
  focusedLinkId: string | null;
}

export interface AppActions {
  finishEditingLink: (link: Link) => void;
  clickEditLink: (link: Link) => void;
  blurLink: (link: Link) => void;
  clickAddLink: () => void;
}

export class AppComponent extends React.Component<{}, AppState> {
  state = {
    links: [
      new Link({ url: 'https://youtu.be/W-ulxMYL3ds' }),
      new Link({ url: 'https://www.skillshare.com/home', alias: 'SkillShare' }),
      new Link({ url: 'https://www.w3schools.com/html/html_css.asp' }),
    ],

    // TODO: I want to set this to null
    focusedLinkId: '',
  };

  finishEditingLink = (newLink: Link) => {
    const index = this.state.links.findIndex((link: Link) => {
      return link.id === newLink.id;
    });
    this.state.links[index] = newLink;
    // TODO: what's the proper way to do this?
    this.setState({
      links: this.state.links,
      focusedLinkId: newLink.id,
    });
  }

  clickEditLink = (link: Link) => {
    this.setState({ focusedLinkId: link.id });
  }

  blurLink = (link: Link) => {
    if (this.state.focusedLinkId === link.id) {
      this.setState({ focusedLinkId: null });
    }
  }

  clickAddLink = () => {
    const link = new Link({ url: '' });
    const joined = this.state.links.concat(link);
    this.setState({
      links: joined,
      focusedLinkId: link.id,
    });
  }

  render() {
    const actions: AppActions = {
      finishEditingLink: this.finishEditingLink,
      clickEditLink: this.clickEditLink,
      blurLink: this.blurLink,
      clickAddLink: this.clickAddLink,
    };

    return (
      <div className="app">
        <LinksPaneComponent actions={actions} state={this.state}/>
      </div>
    );
  }
}
