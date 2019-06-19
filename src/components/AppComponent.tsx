import * as React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Link } from '../Link';
import { LinksPaneComponent } from './LinksPaneComponent';
import { GreetingComponent } from './GreetingComponent';

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

export interface DragDropService {
  beginDrag: (draggedRank: number) => void;
  endDrag: (draggedRank: number) => void;
  isOver: (dropTargetRank: number) => void;
}

export const DraggableTypes = {
  LINK: 'link',
};

export class AppComponent extends React.Component {
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <InnerAppComponent/>
      </DndProvider>
    );
  }
}

class InnerAppComponent extends React.Component<{}, AppState> {
  state = {
    links: [
      new Link({ url: 'https://youtu.be/W-ulxMYL3ds' }),
      new Link({ url: 'https://www.skillshare.com/home', alias: 'SkillShare' }),
      new Link({ url: 'https://www.w3schools.com/html/html_css.asp' }),
    ],

    // TODO: I want to set this to null
    focusedLinkId: '',
  };

  private draggedRank: number | null = null;

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

  isOver = (dropTargetRank: number) => {
    // TODO: do the array operations properly
    const links: Link[] = this.state.links.map(link => link);
    const draggedLink = links[this.draggedRank];
    if (this.draggedRank > dropTargetRank) {
      for (let i = this.draggedRank; i > dropTargetRank; --i) {
        links[i] = links[i - 1];
      }
    } else {
      for (let i = this.draggedRank; i < dropTargetRank; ++i) {
        links[i] = links[i + 1];
      }
    }
    links[dropTargetRank] = draggedLink;

    this.draggedRank = dropTargetRank;

    this.setState({ links });
  }

  beginDrag = (draggedRank: number) => {
    this.draggedRank = draggedRank;
  }

  endDrag = (draggedRank: number) => {
    this.draggedRank = null;
  }

  render() {
    const actions: AppActions = {
      finishEditingLink: this.finishEditingLink,
      clickEditLink: this.clickEditLink,
      blurLink: this.blurLink,
      clickAddLink: this.clickAddLink,
    };

    const dragDropService: DragDropService = {
      isOver: this.isOver,
      beginDrag: this.beginDrag,
      endDrag: this.endDrag,
    };

    return (
      <div className="app">
        <LinksPaneComponent
          actions={actions}
          state={this.state}
          dragDropService={dragDropService}
        />
        <GreetingComponent name={'Eric'}/>
      </div>
    );
  }
}
