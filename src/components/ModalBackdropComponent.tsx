import * as React from 'react';

export const modalPositionStyles = (triggerRef: React.RefObject<HTMLDivElement>): React.CSSProperties => {
  const referenceRect = triggerRef.current.getBoundingClientRect();

  const {
    top: referenceTop,
    bottom: referenceBottom,
    left: referenceLeft,
    right: referenceRight,
  } = referenceRect;

  const x = (referenceLeft + referenceRight) / 2;
  const y = (referenceTop + referenceBottom) / 2;

  const transform = `translate(${x}px, ${y}px)`;

  return {
    transform: transform,
    WebkitTransform: transform,
  };
};

interface Props {
  additionalClasses?: string;
  save?: () => void;
  cancel: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  triggerRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactElement;
}

export class ModalBackdropComponent extends React.Component<Props> {

  componentDidMount = () => {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  save = () => {
    if (this.props.save !== undefined) {
      this.props.save();
    }
  }

  cancel = () => {
    if (this.props.cancel !== undefined) {
      this.props.cancel();
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 13) {
      // Pressed enter
      this.save();
    } else if (event.keyCode === 27) {
      // Pressed escape
      this.cancel();
    }
  }

  onClick = (event: React.MouseEvent) => {
    if (this.props.modalRef.current.contains(event.target as Node)) {
      // Clicked inside the modal. Do nothing.
      return;
    }
    this.cancel();
  }

  render() {
    let classes = 'modal-backdrop';
    if (this.props.additionalClasses) {
      classes += (' ' + this.props.additionalClasses)
    }

    const childComponent = this.props.triggerRef === undefined ? (this.props.children) : (
      <div className="modal-container" style={modalPositionStyles(this.props.triggerRef)}>
        { this.props.children }
      </div>
    );

    return (
      <div className={classes} onClick={this.onClick}>
        { childComponent }
      </div>
    );
  }

}
