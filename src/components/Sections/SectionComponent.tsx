import * as React from 'react';
import { connect } from 'react-redux';
import { IconContext } from 'react-icons';
import { FaChevronDown, FaChevronUp, FaPen, FaPlus, FaTrash } from 'react-icons/fa';

import { AppState } from 'reduxStore';
import { Folder } from 'Folder';
import { Bookmark } from 'Bookmark';
import { DraggableType } from 'components/AppComponent';

import * as AddBookmarksActions from 'actions/AddBookmarksActions';
import { ExternalShowModalParams } from 'actions/AddBookmarksActions';
import * as DragBookmarkActions from 'actions/DragBookmarkActions';
import { DragBookmarkParams, DropBookmarkParams } from 'actions/DragBookmarkActions';
import * as SectionActions from 'actions/SectionActions';
import { SectionParams } from 'actions/SectionActions';
import * as EditFolderActions from 'actions/EditFolderActions';
import { EditFolderParams } from 'actions/EditFolderActions';
import * as DeleteFolderActions from 'actions/DeleteFolderActions';
import { DeleteFolderParams } from 'actions/DeleteFolderActions';

import { BookmarkComponent } from 'components/BookmarkComponent';
import { DragSourceContainerComponent } from 'components/Sections/DragSourceContainerComponent';
import { DropTargetContainerComponent } from 'components/Sections/DropTargetContainerComponent';
import { EditTextFieldComponent } from 'components/EditTextFieldComponent';
import { ConfirmDeleteFolderModalComponent } from 'components/ConfirmDeleteFolderModalComponent';
import { HoverableContainerComponent } from 'components/HoverableContainerComponent';

interface ExternalProps {
  folder: Folder;
  rank: number;
  editing: boolean;
  deleting: boolean;
  hovering: boolean;
}

interface InternalProps extends ExternalProps {
  editingBookmarkId: string | null;
  hoverItemId: string | null;
  draggedFolderRank: number | null;
  draggedBookmarkRank: number | null;
  showAddBookmarksModal: (params: ExternalShowModalParams) => void;
  beginDrag: (params: DragBookmarkParams) => void;
  endDrag: (params: DropBookmarkParams) => void;
  isOver: (params: DragBookmarkParams) => void;
  expandSection: (params: SectionParams) => void;
  collapseSection: (params: SectionParams) => void;
  beginEdit: (params: EditFolderParams) => void;
  cancelEdit: (params: {}) => void;
  saveEdit: (params: EditFolderParams) => void;
  beginDelete: (params: DeleteFolderParams) => void;
  confirmDelete: (params: DeleteFolderParams) => void;
  cancelDelete: (params: DeleteFolderParams) => void;
}

class SectionComponent extends React.Component<InternalProps> {

  private textInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  private deleteIconRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount = () => {
    document.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.onMouseDown);
  }

  // The purpose of this is to appropriately cancel editing the Folder name.
  onMouseDown = (event: MouseEvent) => {
    if (!this.props.editing) {
      return;
    }
    if (this.textInputRef.current.contains(event.target as Node)) {
      return;
    }
    // Clicked on something else.
    this.cancelEdit();
  }

  onClickEdit = () => {
    this.props.beginEdit({ folder: this.props.folder });
  }

  cancelEdit = () => {
    this.props.cancelEdit({});
  }

  saveEdit = (newName: string) => {
    const newFolder = this.props.folder.withName(newName);
    this.props.saveEdit({ folder: newFolder });
  }

  onClickDelete = () => {
    this.props.beginDelete({ folder: this.props.folder });
  }

  confirmDelete = () => {
    this.props.confirmDelete({ folder: this.props.folder });
  }

  cancelDelete = () => {
    this.props.cancelDelete({ folder: this.props.folder });
  }

  onClickAddBookmarks = () => {
    this.props.showAddBookmarksModal({ folder: this.props.folder });
  }

  expandFolder = () => {
    if (this.props.editing) {
      return;
    }
    this.props.expandSection({ folder: this.props.folder });
  }

  collapseFolder = () => {
    if (this.props.editing) {
      return;
    }
    this.props.collapseSection({ folder: this.props.folder });
  }

  maybeButtonsComponent = () => {
    if (this.props.deleting || (this.props.hovering && !this.props.editing)) {
      return (
        <div className="section-buttons-container">
          <IconContext.Provider value={{ size: '1.0em' }}>
            <FaPen className="section-button" onClick={this.onClickEdit}/>
            <div className="delete-icon-container" ref={this.deleteIconRef} onClick={this.onClickDelete}>
              <FaTrash className="section-button"/>
            </div>
          </IconContext.Provider>
        </div>
      );
    } else {
      return null;
    }
  }

  bookmarkComponents = () => {
    const bookmarkComponents = this.props.folder.bookmarks.map((bookmark: Bookmark, rank: number) => {
      const editing = bookmark.id === this.props.editingBookmarkId;
      const dragging = (
        this.props.rank === this.props.draggedFolderRank && rank === this.props.draggedBookmarkRank
      );
      const hovering = bookmark.id === this.props.hoverItemId;
      const draggable = !editing;
      return (
        <DropTargetContainerComponent
          key={bookmark.id}
          className="list-item-container"
          draggableType={DraggableType.Bookmark}
          isOver={() => this.props.isOver({ folderRank: this.props.rank, bookmarkRank: rank })}
          rerenderProps={[draggable, bookmark, editing, dragging, hovering, rank]}
        >
          <DragSourceContainerComponent
            draggableType={DraggableType.Bookmark}
            beginDrag={() => this.props.beginDrag({ folderRank: this.props.rank, bookmarkRank: rank })}
            endDrag={(trueDrop: boolean) => this.props.endDrag({ trueDrop })}
            draggable={draggable}
          >
            <BookmarkComponent
              bookmark={bookmark}
              editing={editing}
              dragging={dragging}
              hovering={hovering}
              rank={rank}
            />
          </DragSourceContainerComponent>
        </DropTargetContainerComponent>
      );
    });
    return bookmarkComponents;
  }

  render() {
    const { folder } = this.props;

    const sectionNameComponent = this.props.editing ? (
      <EditTextFieldComponent
        textInputRef={this.textInputRef}
        initialText={folder.name}
        save={this.saveEdit}
        cancel={this.cancelEdit}
      />
    ) : (
      <div className="section-name">
        { folder.name }
      </div>
    );

    const maybeConfirmDeleteModalComponent = this.props.deleting ? (
      <ConfirmDeleteFolderModalComponent
        triggerRef={this.deleteIconRef}
        folder={this.props.folder}
        confirmDelete={this.confirmDelete}
        cancelDelete={this.cancelDelete}
      />
    ) : null;

    const maybeEditingClass = this.props.editing ? 'editing' : '';

    if (folder.collapsed) {
      return (
        <div className="section collapsed">
          <HoverableContainerComponent className="section-name-container" itemId={folder.id}>
            <div className={'icon-and-name-container ' + maybeEditingClass} onClick={this.expandFolder}>
              <div className="down-icon">
                <FaChevronDown/>
              </div>
              { sectionNameComponent }
            </div>
            { this.maybeButtonsComponent() }
          </HoverableContainerComponent>
          { maybeConfirmDeleteModalComponent }
        </div>
      );
    }

    return (
      <div className="section">
        <DropTargetContainerComponent
          className="section-name-container"
          draggableType={DraggableType.Bookmark}
          isOver={() => this.props.isOver({ folderRank: this.props.rank, bookmarkRank: -1 })}
          rerenderProps={[folder.name, this.props.editing, this.props.hovering]}
        >
          <HoverableContainerComponent className="section-name-hoverable-container" itemId={folder.id}>
            <div className={'icon-and-name-container ' + maybeEditingClass} onClick={this.collapseFolder}>
              <div className="up-icon">
                <FaChevronUp/>
              </div>
              { sectionNameComponent }
            </div>
            { this.maybeButtonsComponent() }
          </HoverableContainerComponent>
        </DropTargetContainerComponent>
        <div className="section-bookmarks">
          { this.bookmarkComponents() }
        </div>
        <DropTargetContainerComponent
          className="add-bookmark-button-container"
          draggableType={DraggableType.Bookmark}
          isOver={() => this.props.isOver({ folderRank: this.props.rank, bookmarkRank: folder.bookmarks.length })}
          rerenderProps={[this.props.rank, folder.bookmarks.length]}
        >
          <div className="add-bookmark-button" onClick={this.onClickAddBookmarks}>
            <FaPlus className="add-bookmark-icon"/>
          </div>
        </DropTargetContainerComponent>
        { maybeConfirmDeleteModalComponent }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    editingBookmarkId: state.editBookmarkState.editingBookmarkId,
    draggedBookmarkRank: state.dragBookmarkState.bookmarkRank,
    draggedFolderRank: state.dragBookmarkState.folderRank,
    hoverItemId: state.hoverState.hoverItemId,
  };
};

const mapActionsToProps = {
  showAddBookmarksModal: AddBookmarksActions.showModal,
  beginDrag: DragBookmarkActions.begin,
  endDrag: DragBookmarkActions.end,
  isOver: DragBookmarkActions.isOver,
  expandSection: SectionActions.expandSection,
  collapseSection: SectionActions.collapseSection,
  beginEdit: EditFolderActions.beginEdit,
  cancelEdit: EditFolderActions.cancel,
  saveEdit: EditFolderActions.save,
  beginDelete: DeleteFolderActions.beginDelete,
  confirmDelete: DeleteFolderActions.confirmDelete,
  cancelDelete: DeleteFolderActions.cancelDelete,
};

const Component = connect(mapStateToProps, mapActionsToProps)(SectionComponent);
export { Component as SectionComponent };
