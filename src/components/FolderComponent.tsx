import * as React from 'react';
import { connect } from 'react-redux';
import { FaFolder, FaPalette } from 'react-icons/fa';

import { Folder } from '../Folder';
import { OpenFolderParams } from '../actions/FolderActions';
import * as FolderActions from '../actions/FolderActions';
import { EditFolderParams } from '../actions/EditFolderActions';
import * as EditFolderActions from '../actions/EditFolderActions';

import { AppState } from '../reduxStore';
import { EditTextFieldComponent } from './EditTextFieldComponent';
import { HoverableListItemComponent } from './HoverableListItemComponent';
import { FolderButtonsComponent } from './FolderButtonsComponent';
import { FolderColorPickerModalComponent } from './FolderColorPickerModalComponent';

interface ExternalProps {
  folder: Folder;
  editing: boolean;
  dragging: boolean;
  hovering: boolean;

  isDragPreview?: boolean;

  // This just gets passed down to HoverableListItemComponent
  rank: number;
}

interface InternalProps extends ExternalProps {
  showingColorPicker: boolean;
  openFolder: (params: OpenFolderParams) => void;
  cancelEdit: (params: {}) => void;
  saveEdit: (params: EditFolderParams) => void;
  showColorPicker: (params: EditFolderParams) => void;
  hideColorPicker: (params: EditFolderParams) => void;
}

class FolderComponent extends React.Component<InternalProps> {

  private colorPickerIconRef: React.RefObject<HTMLDivElement> = React.createRef();
  private textInputRef: React.RefObject<HTMLInputElement> = React.createRef();

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

  onClick = (event: React.MouseEvent) => {
    this.props.openFolder({ folder: this.props.folder });
  }

  saveEdit = (newName: string) => {
    const newFolder = this.props.folder.withName(newName);
    this.props.saveEdit({ folder: newFolder });
  }

  cancelEdit = () => {
    this.props.cancelEdit({});
  }

  onClickColorPicker = () => {
    if (this.props.editing) {
      this.props.showColorPicker({ folder: this.props.folder });
    }
  }

  render() {
    const { dragging, editing, folder, hovering } = this.props;

    const folderName = editing ? (
      <>
        <EditTextFieldComponent
          textInputRef={this.textInputRef}
          initialText={folder.name}
          save={this.saveEdit}
          cancel={this.cancelEdit}
        />
        <div className="folder-palette-icon-container"
          ref={this.colorPickerIconRef}
        >
          <FaPalette className="folder-palette-icon"
            onClick={this.onClickColorPicker}
          />
        </div>
      </>

    ) : (
      <div className="folder-name" onClick={this.onClick}>
        { folder.name }
      </div>
    );

    const shouldShowButtons = this.props.isDragPreview || (hovering && !editing);
    const shouldShowBoxShadow = shouldShowButtons || editing;

    const maybeButtons = shouldShowButtons ? <FolderButtonsComponent folder={folder}/> : null;
    const maybeColorPicker = (editing && this.props.showingColorPicker) ? (
      <FolderColorPickerModalComponent
        folder={folder}
        colorPickerIconBoundingRect={this.colorPickerIconRef.current.getBoundingClientRect()}
        cancel={() => {
          this.textInputRef.current.focus();
          this.props.hideColorPicker({ folder: this.props.folder });
        }}
      />
    ) : null;

    let classes = 'folder';
    if (dragging) {
      classes += ' vanished';
    }
    if (shouldShowBoxShadow) {
      classes += ' with-shadow';
    }

    return (
      <HoverableListItemComponent className={classes} rank={this.props.rank}>
        <FaFolder className="folder-icon"/>
        { folderName }
        { maybeButtons }
        { maybeColorPicker }
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
  cancelEdit: EditFolderActions.cancel,
  saveEdit: EditFolderActions.save,
  showColorPicker: EditFolderActions.showColorPicker,
  hideColorPicker: EditFolderActions.hideColorPicker,
};

const Component = connect(mapStateToProps, mapActionsToProps)(FolderComponent);
export { Component as FolderComponent };
