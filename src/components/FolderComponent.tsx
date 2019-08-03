import * as React from 'react';
import { connect } from 'react-redux';
import { FaFolder } from 'react-icons/fa';

import { Folder } from '../Folder';
import { OpenFolderParams } from '../actions/FolderActions';
import * as FolderActions from '../actions/FolderActions';
import { EditFolderParams } from '../actions/EditFolderActions';
import * as EditFolderActions from '../actions/EditFolderActions';

import { AppState } from '../reduxStore';
import { EditTextFieldComponent } from './EditTextFieldComponent';
import { HoverableListItemComponent } from './HoverableListItemComponent';
import { FolderButtonsComponent } from './FolderButtonsComponent';

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
  openFolder: (params: OpenFolderParams) => void;
  cancelEdit: (params: {}) => void;
  saveEdit: (params: EditFolderParams) => void;
}

class FolderComponent extends React.Component<InternalProps> {

  onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    this.props.openFolder({ folder: this.props.folder });
  }

  saveEdit = (newName: string) => {
    const newFolder = this.props.folder.withName(newName);
    this.props.saveEdit({ folder: newFolder });
  }

  cancelEdit = () => {
    this.props.cancelEdit({});
  }

  render() {
    const { dragging, editing, folder, hovering } = this.props;

    const folderName = editing ? (
      <EditTextFieldComponent
        initialText={folder.name}
        save={this.saveEdit}
        cancel={this.cancelEdit}
      />
    ) : (
      // This is a hack. What is even happening here...
      // Original code:
      //   <div className="folder-name" onClick={this.onClick}>
      //     { folder.name }
      //   </div>
      // But with above, the onDragEnd hook doesn't fire inside HoverableListItemComponent!
      // Why???????
      <a className="folder-name" href={'randomurl'} onClick={this.onClick}>
        { folder.name }
      </a>
    );

    const shouldShowButtons = this.props.isDragPreview || (hovering && !editing);
    const shouldShowBoxShadow = shouldShowButtons || editing;

    const maybeButtons = shouldShowButtons ? <FolderButtonsComponent folder={folder}/> : null;

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
      </HoverableListItemComponent>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  openFolder: FolderActions.openFolder,
  cancelEdit: EditFolderActions.cancel,
  saveEdit: EditFolderActions.save,
};

const Component = connect(mapStateToProps, mapActionsToProps)(FolderComponent);
export { Component as FolderComponent };
