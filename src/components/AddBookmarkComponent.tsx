import * as React from 'react';
import { IconContext } from 'react-icons';
import { FaPlus } from 'react-icons/fa';

interface Props {
  add: () => void;
}

export class AddBookmarkComponent extends React.Component<Props> {
  render() {
    return (
      <div className="add-bookmark" onClick={this.props.add}>
        <IconContext.Provider value={{ className: 'fa-plus' }}>
          <FaPlus/>
        </IconContext.Provider>
      </div>
    );
  }
}
