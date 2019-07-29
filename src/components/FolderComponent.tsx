import * as React from 'react';

import { Folder } from '../Folder';

interface Props {
  folder: Folder;
}

export class FolderComponent extends React.Component<Props> {
  render() {
    return (
      <div className="folder">
        { this.props.folder.name }
      </div>
    );
  }
}
