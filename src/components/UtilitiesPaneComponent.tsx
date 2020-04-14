import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';

import { FolderListComponent } from 'components/FolderListComponent';

interface Props {
}

export class UtilitiesPaneComponent extends React.Component<Props> {
  render() {
    return (
      <div className="utilities-pane">
        <div className="tabs">
          <div className="bookmarks-tab">
            Bookmarks
          </div>
          <div className="notes-tab">
            Notes
          </div>
        </div>
        <div className="pane">
          <Scrollbars>
            <FolderListComponent/>
          </Scrollbars>
        </div>
      </div>
    );
  }
}
