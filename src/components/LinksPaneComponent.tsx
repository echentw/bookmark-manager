import * as React from 'react';

import { Link } from '../Link';
import { LinkComponent } from './LinkComponent';
import { LinkContainerComponent } from './LinkContainerComponent';
import { AddLinkComponent } from './AddLinkComponent';
import { EditLinkComponent } from './EditLinkComponent';

import { AppService, AppState, DragDropService } from './AppComponent';

interface Props {
  appService: AppService;
  appState: AppState;
  dragDropService: DragDropService;
}

export class LinksPaneComponent extends React.Component<Props> {
  render() {
    const { appService, appState, dragDropService } = this.props;

    const linkComponents = appState.links.map((link: Link, rank: number) => {
      const editing = link.id === appState.editingLinkId;
      return (
        <LinkContainerComponent
          key={link.id}
          dragDropService={dragDropService}
          rank={rank}
        >
          <LinkComponent
            link={link}
            editing={editing}
            appService={appService}
            appState={appState}
            dragDropService={dragDropService}
            rank={rank}
          />
        </LinkContainerComponent>
      );
    });
    return (
      <div className="links-pane">
        { linkComponents }
        <AddLinkComponent add={appService.clickAddLink}/>
      </div>
    );
  }
}
