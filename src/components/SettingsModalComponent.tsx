import * as React from 'react';
import { connect } from 'react-redux';
import { FaCircleNotch, FaUpload } from 'react-icons/fa';

import { AppState } from '../reduxStore';
import { LocalStorageHelpers } from '../LocalStorageHelpers';
import * as SettingsActions from '../actions/SettingsActions';
import { SetImageTimestampParams } from '../actions/SettingsActions';
import { ModalBackdropComponent } from './ModalBackdropComponent';

interface Props {
  hideModal: () => void;
  setImageTimestamp: (params: SetImageTimestampParams) => void;
}

interface State {
  imageLoading: boolean;
}

class SettingsModalComponent extends React.Component<Props, State> {

  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();

  state: State = {
    imageLoading: false,
  };

  onFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        alert('Please only upload PNG or JPEG images!');
        return;
      }

      try {
        this.setState({ imageLoading: true });
        await LocalStorageHelpers.saveImage(file);
        this.setState({ imageLoading: false });
        this.props.setImageTimestamp({ imageTimestamp: Date.now().toString() });
      } catch(e) {
        alert(e.message);
      }
    }
  }

  cancel = () => {
    this.props.hideModal();
  }

  onClickResetBackgroundImage = () => {
    LocalStorageHelpers.clearImage();
  }

  render() {
    const imageUrl = require('../../sandbox/wallpapers/moon.png');

    const maybeImageLoadingIcon = this.state.imageLoading ? (
      <FaCircleNotch className="background-image-loading-icon"/>
    ) : null;

    const backgroundImageCustomStyles = this.state.imageLoading ? ({
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }) : {};

    const maybeUploadIcon = !this.state.imageLoading ? (
      <FaUpload className="background-image-upload-icon"/>
    ) : null;

    const modalComponent = (
      <div className="settings-modal" ref={this.modalRef}>
        <div className="settings-title">
          Settings
        </div>
        <div className="horizontal-bar"/>
        <div className="set-background-image-container">
          <div className="set-background-image-label">
            Background Image
          </div>
          <div className="set-background-image-reset-container">
            <div className="set-background-image-reset" onClick={this.onClickResetBackgroundImage}>
              Reset to default
            </div>
          </div>
          <div className="set-background-image-preview-container">
            <input
              id="file"
              className="set-background-image-input"
              type="file"
              onChange={this.onFileInputChange}
            />
            <img src={imageUrl}/>
            <label htmlFor="file" className="set-background-image-preview" style={backgroundImageCustomStyles}>
              { maybeImageLoadingIcon }
              { maybeUploadIcon }
            </label>
          </div>
        </div>
      </div>
    );

    return (
      <ModalBackdropComponent
        additionalClasses={'settings-layer'}
        cancel={this.cancel}
        modalRef={this.modalRef}
      >
        { modalComponent }
      </ModalBackdropComponent>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {};
};

const mapActionsToProps = {
  hideModal: SettingsActions.hideModal,
  setImageTimestamp: SettingsActions.setImageTimestamp,
};

const Component = connect(mapStateToProps, mapActionsToProps)(SettingsModalComponent);
export { Component as SettingsModalComponent };
