import * as React from 'react';
import { connect } from 'react-redux';

import { Folder } from 'models/Folder';
import { AppState } from 'reduxStore';
import { DraggableType } from 'components/AppComponent';
import { FolderComponent } from 'components/FolderComponent';
import { AddFolderButtonComponent } from 'components/AddFolderButtonComponent';

interface Props {
  folders: Folder[];
  deletingFolderId: string | null;
  editingFolderId: string | null;
  hoverItemId: string | null;
  draggedType: DraggableType | null;
  draggedFolderRank: number | null;
  editingBookmarkId: string | null;
}

class FolderListComponent extends React.Component<Props> {
  render() {
    const folderComponents = this.props.folders.map((folder: Folder, rank: number) => {
      const deleting = folder.id === this.props.deletingFolderId;
      const editing = folder.id === this.props.editingFolderId;
      const dragging = (this.props.draggedType === DraggableType.Folder && rank === this.props.draggedFolderRank);
      const hovering = folder.id === this.props.hoverItemId;
      const draggable = (
        this.props.deletingFolderId === null &&
        this.props.editingFolderId === null &&
        this.props.editingBookmarkId === null
      );
      return (
        <FolderComponent
          key={folder.id}
          folder={folder}
          editing={editing}
          deleting={deleting}
          hovering={hovering}
          rank={rank}
          dragging={dragging}
          draggable={draggable}
        />
      );
    });

    return (
      <div className="folder-list">
        { folderComponents }
        <AddFolderButtonComponent/>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    folders: state.foldersState.folders,
    deletingFolderId: state.deleteFolderState.deletingFolderId,
    editingFolderId: state.editFolderState.editingFolderId,
    draggedType: state.dragState.draggableType,
    draggedFolderRank: state.dragState.folderRank,
    hoverItemId: state.hoverState.hoverItemId,
    editingBookmarkId: state.editBookmarkState.editingBookmarkId,
  };
};

const Component = connect(mapStateToProps)(FolderListComponent);
export { Component as FolderListComponent };
