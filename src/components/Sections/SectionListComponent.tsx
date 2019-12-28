import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';

import { Folder } from 'Folder';
import { AppState } from 'reduxStore';
import { DraggableType } from 'components/AppComponent';
import { DragDropListItemContainerComponent } from 'components/DragDropListItemContainerComponent';
import { SectionComponent } from 'components/Sections/SectionComponent';
import { AddSectionButtonComponent } from 'components/Sections/AddSectionButtonComponent';

interface Props {
  folders: Folder[];
  deletingFolderId: string | null;
  editingFolderId: string | null;
  draggedRank: number | null;
  hoverRank: number | null;
}

class SectionListComponent extends React.Component<Props> {
  render() {
    const sectionComponents = this.props.folders.map((folder: Folder, rank: number) => {
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
          <SectionComponent
            folder={folder}
          />
        </DragDropListItemContainerComponent>
      );
    });

    return (
      <div className="section-list">
        <Scrollbars>
          <div className="section-list-scrollable-area">
            { sectionComponents }
            <AddSectionButtonComponent/>
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
  };
};

const Component = connect(mapStateToProps)(SectionListComponent);
export { Component as SectionListComponent };
