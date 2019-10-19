import * as React from 'react';
import { connect } from 'react-redux';
import { FaUpload } from 'react-icons/fa';

import * as defaultBackgroundImageUrl from '../../sandbox/wallpapers/moon.png';

import { AppState } from '../reduxStore';
import { LocalStorageHelpers } from '../LocalStorageHelpers';
import * as SettingsActions from '../actions/SettingsActions';
import { SetImageTimestampParams } from '../actions/SettingsActions';
import { ModalBackdropComponent } from './ModalBackdropComponent';

interface Props {
  hideModal: () => void;
  setImageTimestamp: (params: SetImageTimestampParams) => void;
}

class SettingsModalComponent extends React.Component<Props> {

  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();

  onFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        alert('Please only upload PNG or JPEG images!');
        return;
      }

      try {
        await LocalStorageHelpers.saveImage(file);
        this.props.setImageTimestamp({ imageTimestamp: Date.now().toString() });
      } catch(e) {
        console.log(e);
        alert('That image size is too big!');
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
    const imageUrl = defaultBackgroundImageUrl;

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
            <label htmlFor="file" className="set-background-image-preview">
              <FaUpload className="background-image-upload-icon"/>
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
