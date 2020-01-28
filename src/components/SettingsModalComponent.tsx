import * as React from 'react';
import { connect } from 'react-redux';
import { FaCircleNotch, FaLink, FaUpload } from 'react-icons/fa';
import * as CopyToClipboard from 'react-copy-to-clipboard';

import { AppState } from 'reduxStore';
import { LocalStorageHelpers } from 'LocalStorageHelpers';
import * as CopyUrlActions from 'actions/CopyUrlActions';
import { ShowToastParams } from 'actions/CopyUrlActions';
import * as SettingsActions from 'actions/SettingsActions';
import { SetBackgroundImageParams } from 'actions/SettingsActions';
import { ModalBackdropComponent } from 'components/ModalBackdropComponent';

interface Props {
  backgroundImageUrl: string;
  hideModal: () => void;
  setBackgroundImage: (params: SetBackgroundImageParams) => void;
  showCopyUrlToast: (params: ShowToastParams) => void;
}

enum Section {
  Settings,
  About,
}

interface State {
  imageLoading: boolean;
  activeSection: Section;
}

class SettingsModalComponent extends React.Component<Props, State> {

  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();
  private fileInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  private axleLinkRef: React.RefObject<HTMLInputElement> = React.createRef();

  state: State = {
    imageLoading: false,
    activeSection: Section.Settings,
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
      url: require('assets/wallpapers/moon.json').url,
    });
  }

  settingsSectionComponent = () => {
    const maybeImageLoadingIcon = this.state.imageLoading ? (
      <FaCircleNotch className="background-image-loading-icon"/>
    ) : null;

    const backgroundImageCustomStyles = this.state.imageLoading ? ({
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }) : {};

    const maybeUploadIcon = !this.state.imageLoading ? (
      <FaUpload className="background-image-upload-icon"/>
    ) : null;

    return (
      <div className="settings-section">
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
            <img src={this.props.backgroundImageUrl}/>
            <label htmlFor="file" className="set-background-image-preview" style={backgroundImageCustomStyles}>
              { maybeImageLoadingIcon }
              { maybeUploadIcon }
            </label>
          </div>
        </div>
      </div>
    );
  }

  highlightAxleLink = () => {
    this.axleLinkRef.current.select();
  }

  onClickCopy = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    this.props.showCopyUrlToast({ x: clientX, y: clientY });
    this.highlightAxleLink();
  }

  aboutSectionComponent = () => {
    const axleLink = 'http://bit.ly/axle-new-tab';
    return (
      <div className="about-section">
        <div className="about-text-container">
          <p>
            Hi, I'm Eric, the developer of Axle.
            First and foremost, thanks for installing!
            I hope you find it useful and pleasant to use.
            Axle was created to meet the following needs:
          </p>
          <ul>
            <li>Have a crisp, personalized new tab experience.</li>
            <li>Have easy access to your bookmarks.</li>
            <li>Remove bookmarks bar clutter, freeing up screen space.</li>
          </ul>
          <p>
            I'm actively working to make Axle better.
            Stay tuned, and don't hesitate to reach out to me with comments, suggestions, or questions.
            Feel free to leave a comment on the Chrome extension page (link below) or email me directly
            at <a href="mailto:ericchen098@gmail.com">ericchen098@gmail.com</a>.
          </p>
        </div>
        <div className="shareable-link-container">
          <div className="shareable-link-label">
            Share Axle with your friends!
          </div>
          <div className="shareable-link">
            <input
              type="text"
              value={axleLink}
              className="shareable-link-url"
              readOnly
              onClick={this.highlightAxleLink}
              ref={this.axleLinkRef}
            />
            <CopyToClipboard text={axleLink}>
              <FaLink className="shareable-link-icon" onClick={this.onClickCopy}/>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  }

  onClickSettingsTitle = () => {
    this.setState({ activeSection: Section.Settings });
  }

  onClickAboutTitle = () => {
    this.setState({ activeSection: Section.About });
  }

  render() {
    let sectionComponent: React.ReactElement;
    let settingsTitleCssClass: string;
    let aboutTitleCssClass: string;
    if (this.state.activeSection === Section.Settings) {
      sectionComponent = this.settingsSectionComponent();
      settingsTitleCssClass = 'active';
      aboutTitleCssClass = '';
    } else {
      sectionComponent = this.aboutSectionComponent();
      settingsTitleCssClass = '';
      aboutTitleCssClass = 'active';
    }

    const modalComponent = (
      <div className="settings-modal" ref={this.modalRef}>
        <div className="titles-container">
          <div
            className={'title settings-title ' + settingsTitleCssClass}
            onClick={this.onClickSettingsTitle}
          >
            Settings
          </div>
          <div
            className={'title about-title ' + aboutTitleCssClass}
            onClick={this.onClickAboutTitle}
          >
            About
          </div>
        </div>
        <div className="horizontal-bar"/>
        { sectionComponent }
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
  showCopyUrlToast: CopyUrlActions.showToast,
};

const Component = connect(mapStateToProps, mapActionsToProps)(SettingsModalComponent);
export { Component as SettingsModalComponent };
