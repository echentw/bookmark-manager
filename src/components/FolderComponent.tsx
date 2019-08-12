import * as React from 'react';
import { connect } from 'react-redux';
import { IconContext } from 'react-icons';
import {
  FaFolder,
  FaPalette,
  FaPen,
  FaTrash,
} from 'react-icons/fa';

import { Folder, colorsToCssClasses } from '../Folder';
import { DeleteFolderParams } from '../actions/DeleteFolderActions';
import * as DeleteFolderActions from '../actions/DeleteFolderActions';
import { OpenFolderParams } from '../actions/FolderActions';
import * as FolderActions from '../actions/FolderActions';
import { EditFolderParams } from '../actions/EditFolderActions';
import * as EditFolderActions from '../actions/EditFolderActions';

import { AppState } from '../reduxStore';
import { EditTextFieldComponent } from './EditTextFieldComponent';
import { HoverableListItemComponent } from './HoverableListItemComponent';
import { FolderColorPickerModalComponent } from './FolderColorPickerModalComponent';
import { ConfirmDeleteFolderModalComponent } from './ConfirmDeleteFolderModalComponent';

interface ExternalProps {
  folder: Folder;
  deleting: boolean;
  editing: boolean;
  dragging: boolean;
  hovering: boolean;

  isDragPreview?: boolean;

  // This just gets passed down to HoverableListItemComponent
  rank: number;
}

interface InternalProps extends ExternalProps {
  showingColorPicker: boolean;
  beginEdit: (params: EditFolderParams) => void;
  openFolder: (params: OpenFolderParams) => void;
  cancelEdit: (params: {}) => void;
  saveEdit: (params: EditFolderParams) => void;
  showColorPicker: (params: EditFolderParams) => void;
  hideColorPicker: (params: EditFolderParams) => void;
  beginDelete: (params: DeleteFolderParams) => void;
  confirmDelete: (params: DeleteFolderParams) => void;
  cancelDelete: (params: DeleteFolderParams) => void;
}

class FolderComponent extends React.Component<InternalProps> {

  private colorPickerIconRef: React.RefObject<HTMLDivElement> = React.createRef();
  private textInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  private deleteIconRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount = () => {
    document.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown = (event: MouseEvent) => {
    if (!this.props.editing || this.props.showingColorPicker) {
      return;
    }
    if (this.colorPickerIconRef.current.contains(event.target as Node) ||
        this.textInputRef.current.contains(event.target as Node)) {
      return;
    }
    // Clicked on something else.
    this.cancelEdit();
  }

  onClickFolder = (event: React.MouseEvent) => {
    this.props.openFolder({ folder: this.props.folder });
  }

  onClickEdit = () => {
    this.props.beginEdit({ folder: this.props.folder });
  }

  onClickDelete = () => {
    this.props.beginDelete({ folder: this.props.folder });
  }

  saveEdit = (newName: string) => {
    const newFolder = this.props.folder.withName(newName);
    this.props.saveEdit({ folder: newFolder });
  }

  cancelEdit = () => {
    this.props.cancelEdit({});
  }

  confirmDelete = () => {
    this.props.confirmDelete({ folder: this.props.folder });
  }

  cancelDelete = () => {
    this.props.cancelDelete({ folder: this.props.folder });
  }

  onClickColorPicker = () => {
    this.props.showColorPicker({ folder: this.props.folder });
  }

  render() {
    const { deleting, dragging, editing, folder, hovering } = this.props;

    const folderNameComponent = editing ? (
      <>
        <EditTextFieldComponent
          textInputRef={this.textInputRef}
          initialText={folder.name}
          save={this.saveEdit}
          cancel={this.cancelEdit}
        />
        <div className="folder-palette-icon-container" ref={this.colorPickerIconRef}>
          <FaPalette className="folder-palette-icon"
            onClick={this.onClickColorPicker}
          />
        </div>
      </>
    ) : (
      <div className="folder-name" onClick={this.onClickFolder}>
        { folder.name }
      </div>
    );

    const shouldShowButtons = this.props.isDragPreview || deleting || (hovering && !editing);
    const shouldShowBoxShadow = shouldShowButtons || editing;

    const maybeButtonsComponent = shouldShowButtons ? (
      <div className="folder-buttons">
        <IconContext.Provider value={{ size: '1.2em' }}>
          <FaPen className="folder-button" onClick={this.onClickEdit}/>
          <div className="delete-icon-container" ref={this.deleteIconRef} onClick={this.onClickDelete}>
            <FaTrash className="folder-button"/>
          </div>
        </IconContext.Provider>
      </div>
    ) : null;

    const maybeColorPickerComponent = (editing && this.props.showingColorPicker) ? (
      <FolderColorPickerModalComponent
        folder={folder}
        triggerRef={this.colorPickerIconRef}
        cancel={() => {
          this.textInputRef.current.focus();
          this.props.hideColorPicker({ folder: this.props.folder });
        }}
      />
    ) : null;

    const maybeConfirmDeleteModalComponent = deleting ? (
      <ConfirmDeleteFolderModalComponent
        triggerRef={this.deleteIconRef}
        confirmDelete={this.confirmDelete}
        cancelDelete={this.cancelDelete}
      />
    ) : null;

    let classes = 'folder';
    if (dragging) {
      classes += ' vanished';
    }
    if (shouldShowBoxShadow) {
      classes += ' with-shadow';
    }

    const color = colorsToCssClasses.get(folder.color);

    return (
      <HoverableListItemComponent className={classes} rank={this.props.rank}>
        <FaFolder className={'folder-icon ' + color}/>
        { folderNameComponent }
        { maybeButtonsComponent }
        { maybeColorPickerComponent }
        { maybeConfirmDeleteModalComponent }
      </HoverableListItemComponent>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {
    showingColorPicker: state.editFolderState.showingColorPicker,
  };
};

const mapActionsToProps = {
  openFolder: FolderActions.openFolder,
  beginEdit: EditFolderActions.beginEdit,
  cancelEdit: EditFolderActions.cancel,
  saveEdit: EditFolderActions.save,
  showColorPicker: EditFolderActions.showColorPicker,
  hideColorPicker: EditFolderActions.hideColorPicker,
  beginDelete: DeleteFolderActions.beginDelete,
  confirmDelete: DeleteFolderActions.confirmDelete,
  cancelDelete: DeleteFolderActions.cancelDelete,
};

const Component = connect(mapStateToProps, mapActionsToProps)(FolderComponent);
export { Component as FolderComponent };
