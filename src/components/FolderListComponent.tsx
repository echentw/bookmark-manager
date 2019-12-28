import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';

import { Folder } from 'Folder';
import { AppState, } from 'reduxStore';
import { DraggableType } from 'components/AppComponent';
import { FolderComponent } from 'components/FolderComponent';
import { DragDropListItemContainerComponent } from 'components/DragDropListItemContainerComponent';
import { AddFolderButtonComponent } from 'components/AddFolderButtonComponent';

interface Props {
  folders: Folder[];
  deletingFolderId: string | null;
  editingFolderId: string | null;
  draggedRank: number | null;
  hoverItemId: string | null;
}

class FolderListComponent extends React.Component<Props> {
  render() {
    const folderComponents = this.props.folders.map((folder: Folder, rank: number) => {
      const deleting = folder.id === this.props.deletingFolderId;
      const editing = folder.id === this.props.editingFolderId;
      const dragging = rank === this.props.draggedRank;
      const hovering = String(rank) === this.props.hoverItemId;
      const draggable = !deleting && !editing;
      return (
        <DragDropListItemContainerComponent
          key={folder.id}
          id={folder.id}
          rank={rank}
          draggableType={DraggableType.Folder}
          draggable={draggable}
        >
          <FolderComponent
            folder={folder}
            deleting={deleting}
            editing={editing}
            dragging={dragging}
            hovering={hovering}
            rank={rank}
          />
        </DragDropListItemContainerComponent>
      );
    });

    return (
      <div className="folder-list">
        <div className="folder-list-title-container">
          <div className="folder-list-title">
            Home
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
    deletingFolderId: state.deleteFolderState.deletingFolderId,
    editingFolderId: state.editFolderState.editingFolderId,
    draggedRank: state.dragDropState.draggedRank,
    hoverItemId: state.hoverState.hoverItemId,
  };
};

const Component = connect(mapStateToProps)(FolderListComponent);
export { Component as FolderListComponent };
