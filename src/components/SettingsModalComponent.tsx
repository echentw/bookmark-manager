import * as React from 'react';
import { connect } from 'react-redux';
import { FaCircleNotch, FaUpload } from 'react-icons/fa';

import { AppState } from '../reduxStore';
import { LocalStorageHelpers } from '../LocalStorageHelpers';
import * as SettingsActions from '../actions/SettingsActions';
import { SetBackgroundImageParams } from '../actions/SettingsActions';
import { ModalBackdropComponent } from './ModalBackdropComponent';

interface Props {
  hideModal: () => void;
  setBackgroundImage: (params: SetBackgroundImageParams) => void;
  backgroundImageUrl: string;
}

interface State {
  imageLoading: boolean;
}

class SettingsModalComponent extends React.Component<Props, State> {

  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();
  private fileInputRef: React.RefObject<HTMLInputElement> = React.createRef();

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
        const backgroundImageUrl = await LocalStorageHelpers.saveBackgroundImage(file);
        this.setState({ imageLoading: false });
        this.props.setBackgroundImage({
          timestamp: Date.now().toString(),
          url: backgroundImageUrl,
        });
      } catch(e) {
        alert(e.message);
      }

      // Clear the input, in case the user uploads the same image again after hitting reset.
      this.fileInputRef.current.value = '';
    }
  }

  cancel = () => {
    this.props.hideModal();
  }

  onClickResetBackgroundImage = () => {
    LocalStorageHelpers.clearBackgroundImage();
    this.props.setBackgroundImage({
      timestamp: Date.now().toString(),
      url: '',
    });
  }

  render() {
    const imageUrl = this.props.backgroundImageUrl ? (
      this.props.backgroundImageUrl
    ) : (
      require('../../sandbox/wallpapers/moon.png')
    );

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
              ref={this.fileInputRef}
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
  return {
    backgroundImageUrl: state.settingsState.backgroundImageUrl,
  };
};

const mapActionsToProps = {
  hideModal: SettingsActions.hideModal,
  setBackgroundImage: SettingsActions.setBackgroundImage,
};

const Component = connect(mapStateToProps, mapActionsToProps)(SettingsModalComponent);
export { Component as SettingsModalComponent };
