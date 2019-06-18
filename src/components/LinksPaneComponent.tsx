import * as React from 'react';

import { Link } from '../Link';
import { LinkComponent } from './LinkComponent';
import { LinkContainerComponent } from './LinkContainerComponent';
import { AddLinkComponent } from './AddLinkComponent';

import { AppActions, AppState, DragDropService } from './AppComponent';

interface Props {
  actions: AppActions;
  state: AppState;
  dragDropService: DragDropService;
}

export class LinksPaneComponent extends React.Component<Props> {
  render() {
    const { actions, state, dragDropService } = this.props;

    const linkComponents = state.links.map((link: Link, rank: number) => {
      const focused = link.id === state.focusedLinkId;
      return (
        <LinkContainerComponent
          key={link.id}
          dragDropService={dragDropService}
          rank={rank}
        >
          <LinkComponent
            link={link}
            focused={focused}
            actions={actions}
            dragDropService={dragDropService}
            rank={rank}
          />
        </LinkContainerComponent>
      );
    });
    return (
      <div className="links-pane">
        { linkComponents }
        <AddLinkComponent add={actions.clickAddLink}/>
      </div>
    );
  }
}
