import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';

import { Folder } from '../Folder';
import { AppState, DraggableType } from './AppComponent';
import { FolderComponent } from './FolderComponent';
import { ListItemContainerComponent } from './ListItemContainerComponent';
import { AddFolderButtonComponent } from './AddFolderButtonComponent';

interface Props {
  folders: Folder[];
  editingFolder: Folder | null;
}

interface State {
  hoverRank: number | null;
}

class FolderListComponent extends React.Component<Props> {
  state: State = {
    hoverRank: null,
  };

  render() {
    const folderComponents = this.props.folders.map((folder: Folder, rank: number) => {
      const editing = this.props.editingFolder && folder.id === this.props.editingFolder.id;
      return (
        <ListItemContainerComponent
          key={folder.id}
          rank={rank}
          draggableType={DraggableType.Folder}
        >
          <FolderComponent
            folder={folder}
            editing={editing}
            rank={rank}
          />
        </ListItemContainerComponent>
      );
    });

    return (
      <div className="folder-list">
        <div className="folder-list-title-container">
          <div className="folder-list-title">
            Folders
          </div>
        </div>
        <Scrollbars>
          <div className="folder-list-scrollable-area">
            { folderComponents }
            <AddFolderButtonComponent/>
          </div>
        </Scrollbars>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    folders: state.foldersState.folders,
    editingFolder: state.foldersState.editingFolder,
  };
};

const Component = connect(mapStateToProps)(FolderListComponent);
export { Component as FolderListComponent };
