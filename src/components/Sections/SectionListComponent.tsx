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
  hoverItemId: string | null;
  draggedType: DraggableType | null;
  draggedFolderRank: number | null;
}

class SectionListComponent extends React.Component<Props> {
  render() {
    const sectionComponents = this.props.folders.map((folder: Folder, rank: number) => {
      const deleting = folder.id === this.props.deletingFolderId;
      const editing = folder.id === this.props.editingFolderId;
      const dragging = (this.props.draggedType === DraggableType.Folder && rank === this.props.draggedFolderRank);
      const hovering = folder.id === this.props.hoverItemId;
      // const draggable = !deleting && !editing;
      return (
        <SectionComponent
          key={folder.id}
          folder={folder}
          editing={editing}
          deleting={deleting}
          hovering={hovering}
          rank={rank}
          dragging={dragging}
        />
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
    draggedType: state.dragState.draggableType,
    draggedFolderRank: state.dragState.folderRank,
    hoverItemId: state.hoverState.hoverItemId,
  };
};

const Component = connect(mapStateToProps)(SectionListComponent);
export { Component as SectionListComponent };
