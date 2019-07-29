import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';

import { Folder } from '../Folder';
import { AppState, DraggableType } from './AppComponent';
import { FolderComponent } from './FolderComponent';
import { ListItemContainerComponent } from './ListItemContainerComponent';

interface Props {
  folders: Folder[];
}

class FolderListComponent extends React.Component<Props> {
  render() {
    const folderComponents = this.props.folders.map((folder: Folder, rank: number) => {
      return (
        <ListItemContainerComponent
          key={folder.id}
          rank={rank}
          draggableType={DraggableType.Folder}
        >
          <FolderComponent folder={folder}/>
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
          { folderComponents }
        </Scrollbars>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    folders: state.foldersState.folders,
  };
};

const Component = connect(mapStateToProps)(FolderListComponent);
export { Component as FolderListComponent };
