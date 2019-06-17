import * as React from 'react';

import { Link } from '../Link';
import { LinkComponent } from './LinkComponent';
import { AddLinkComponent } from './AddLinkComponent';

import { AppActions, AppState } from './AppComponent';

interface Props {
  actions: AppActions;
  state: AppState;
}

export class LinksPaneComponent extends React.Component<Props> {
  render() {
    const { actions, state } = this.props;

    const linkComponents = state.links.map((link) => {
      const focused = link.id === state.focusedLinkId;
      return (
        <LinkComponent
          key={link.id}
          link={link}
          focused={focused}
          actions={actions}
        />
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
