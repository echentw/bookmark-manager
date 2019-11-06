import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import { FaThumbtack } from 'react-icons/fa';

import { Folder } from '../Folder';
import { AppState, } from '../reduxStore';
import * as NavigationActions from '../actions/NavigationActions';
import { DraggableType } from './AppComponent';
import { FolderComponent } from './FolderComponent';
import { DragDropListItemContainerComponent } from './DragDropListItemContainerComponent';
import { AddFolderButtonComponent } from './AddFolderButtonComponent';

interface Props {
  folders: Folder[];
  deletingFolderId: string | null;
  editingFolderId: string | null;
  draggedRank: number | null;
  hoverRank: number | null;
  homePagePinned: boolean;
  toggleHomePagePin: (params: {}) => void;
}

class FolderListComponent extends React.Component<Props> {
  onClickPin = () => {
    this.props.toggleHomePagePin({});
  }

  render() {
    const folderComponents = this.props.folders.map((folder: Folder, rank: number) => {
      const deleting = folder.id === this.props.deletingFolderId;
      const editing = folder.id === this.props.editingFolderId;
      const dragging = rank === this.props.draggedRank;
      const hovering = rank === this.props.hoverRank;
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

    const pinCssClass = this.props.homePagePinned ? 'pinned' : '';

    return (
      <div className="folder-list">
        <div className="folder-list-title-container">
          <div className="folder-list-title">
            Home
          </div>
          <FaThumbtack
            className={'pin-icon ' + pinCssClass}
            onClick={this.onClickPin}
          />
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
    hoverRank: state.hoverState.hoverRank,
    homePagePinned: state.navigationState.homePagePinned,
  };
};

const mapActionsToProps = {
  toggleHomePagePin: NavigationActions.toggleHomePagePin,
};

const Component = connect(mapStateToProps, mapActionsToProps)(FolderListComponent);
export { Component as FolderListComponent };
