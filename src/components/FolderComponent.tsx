import * as React from 'react';
import { connect } from 'react-redux';

import { Folder } from '../Folder';
import { OpenFolderParams } from '../actions/FolderActions';
import * as FolderActions from '../actions/FolderActions';
import { EditFolderParams } from '../actions/EditFolderActions';
import * as EditFolderActions from '../actions/EditFolderActions';

import { AppState } from './AppComponent';
import { EditTextFieldComponent } from './EditTextFieldComponent';
import { HoverableListItemComponent } from './HoverableListItemComponent';

interface ExternalProps {
  folder: Folder;
  editing: boolean;
  hovering: boolean;

  // These two props just get passed down to HoverableListItemComponent
  updateHoverRank: (rank: number, hovering: boolean) => void;
  rank: number;
}

interface InternalProps extends ExternalProps {
  openFolder: (params: OpenFolderParams) => void;
  cancelEdit: (params: {}) => void;
  saveEdit: (params: EditFolderParams) => void;
}

class FolderComponent extends React.Component<InternalProps> {

  onClick = () => {
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
    const { editing, folder, hovering } = this.props;

    const folderName = editing ? (
      <EditTextFieldComponent
        initialText={folder.name}
        save={this.saveEdit}
        cancel={this.cancelEdit}
      />
    ) : (
      <div className="folder-name" onClick={this.onClick}>
        { folder.name }
      </div>
    );

    const shouldShowBoxShadow = hovering || editing;

    let classes = 'folder';
    if (shouldShowBoxShadow) {
      classes += ' with-shadow';
    }

    return (
      <HoverableListItemComponent className={classes}
        rank={this.props.rank}
        updateHoverRank={this.props.updateHoverRank}
      >
        <div>icon</div>
        { folderName }
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
