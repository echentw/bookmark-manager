import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';

import { Folder } from '../Folder';
import { AppState, } from '../reduxStore';
import { DraggableType } from './AppComponent';
import { FolderComponent } from './FolderComponent';
import { ListItemContainerComponent } from './ListItemContainerComponent';
import { DraggableListItemWrapperComponent } from './DraggableListItemWrapperComponent';
import { AddFolderButtonComponent } from './AddFolderButtonComponent';

interface Props {
  folders: Folder[];
  editingFolderId: string | null;
  draggedRank: number | null;
  hoverRank: number | null;
}

class FolderListComponent extends React.Component<Props> {
  render() {
    const folderComponents = this.props.folders.map((folder: Folder, rank: number) => {
      const editing = folder.id === this.props.editingFolderId;
      const dragging = rank === this.props.draggedRank;
      const hovering = rank === this.props.hoverRank;
      return (
        <ListItemContainerComponent
          key={folder.id}
          rank={rank}
          draggableType={DraggableType.Folder}
        >
          <DraggableListItemWrapperComponent
            id={folder.id}
            draggableType={DraggableType.Folder}
            rank={rank}
          >
            <FolderComponent
              folder={folder}
              editing={editing}
              dragging={dragging}
              hovering={hovering}
              rank={rank}
            />
          </DraggableListItemWrapperComponent>
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
    editingFolderId: state.editFolderState.editingFolderId,
    draggedRank: state.dragDropState.draggedRank,
    hoverRank: state.hoverState.hoverRank,
  };
};

const Component = connect(mapStateToProps)(FolderListComponent);
export { Component as FolderListComponent };
