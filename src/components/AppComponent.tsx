import * as React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Link } from '../Link';
import { LinksPaneComponent } from './LinksPaneComponent';
import { GreetingComponent } from './GreetingComponent';
import { DragLayerComponent } from './DragLayerComponent';

export interface AppState {
  links: Link[];
  editingLinkId: string | null;
}

export interface AppService {
  saveLink: (link: Link) => void;
  clickEditLink: (link: Link) => void;
  cancelEditLink: (link: Link) => void;
  deleteLink: (link: Link) => void;
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
      new Link({ url: 'https://react-dnd.github.io/react-dnd/examples/drag-around/custom-drag-layer' }),
    ],

    // TODO: I want to set this to null
    editingLinkId: '',
  };

  private draggedRank: number | null = null;

  saveLink = (newLink: Link) => {
    const index = this.state.links.findIndex((link: Link) => {
      return link.id === newLink.id;
    });
    this.state.links[index] = newLink;
    // TODO: what's the proper way to do this?
    this.setState({
      links: this.state.links,
      editingLinkId: null,
    });
  }

  deleteLink = (link: Link) => {
    const index = this.state.links.findIndex((thisLink: Link) => {
      return thisLink.id === link.id;
    });
    this.state.links.splice(index, 1);
    this.setState({
      links: this.state.links,
      editingLinkId: null,
    });
  }

  clickEditLink = (link: Link) => {
    this.setState({ editingLinkId: link.id });
  }

  cancelEditLink = (link: Link) => {
    if (this.state.editingLinkId === link.id) {
      this.setState({ editingLinkId: null });
    }
  }

  clickAddLink = () => {
    const link = new Link({ url: '' });
    const joined = this.state.links.concat(link);
    this.setState({
      links: joined,
      editingLinkId: link.id,
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
    const appService: AppService = {
      saveLink: this.saveLink,
      clickEditLink: this.clickEditLink,
      cancelEditLink: this.cancelEditLink,
      clickAddLink: this.clickAddLink,
      deleteLink: this.deleteLink,
    };

    const dragDropService: DragDropService = {
      isOver: this.isOver,
      beginDrag: this.beginDrag,
      endDrag: this.endDrag,
    };

    return (
      <div className="app">
        <LinksPaneComponent
          appService={appService}
          appState={this.state}
          dragDropService={dragDropService}
        />
        <GreetingComponent name={'Eric'}/>
        <DragLayerComponent appState={this.state}/>
      </div>
    );
  }
}
