import * as React from 'react';

import { Link } from '../Link';
import { LinkComponent } from './LinkComponent';
import { AddLinkComponent } from './AddLinkComponent';

interface State {
  links: Link[];
  focusedLinkId: string | null;
}

export class LinksPaneComponent extends React.Component<{}, State> {
  state = {
    links: [
      new Link({ url: 'https://youtu.be/W-ulxMYL3ds' }),
      new Link({ url: 'https://www.skillshare.com/home', alias: 'SkillShare' }),
      new Link({ url: 'https://www.w3schools.com/html/html_css.asp' }),
    ],

    // TODO: I want to set this to null
    focusedLinkId: '',
  };

  editLink = (newLink: Link) => {
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

  onClickEdit = (link: Link) => {
    this.setState({ focusedLinkId: link.id });
  }

  onBlur = () => {
    this.setState({ focusedLinkId: null });
  }

  addLink = () => {
    const link = new Link({ url: '' });
    const joined = this.state.links.concat(link);
    this.setState({
      links: joined,
      focusedLinkId: link.id,
    });
  }

  render() {
    const linkComponents = this.state.links.map((link) => {
      const focused = link.id === this.state.focusedLinkId;
      return (
        <LinkComponent
          key={link.id}
          link={link}
          edit={this.editLink}
          focused={focused}
          onClickEdit={this.onClickEdit}
          onBlur={this.onBlur}
        />
      );
    });
    return (
      <div className="links-pane">
        { linkComponents }
        <AddLinkComponent add={this.addLink}/>
      </div>
    );
  }
}
