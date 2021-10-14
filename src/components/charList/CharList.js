import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
  state = {
    chars: [],
    process: 'loading',
    newCharsState: 'loading',
    offset: 210,
  };

  itemRefs = [];

  setRef = (ref) => {
    this.itemRefs.push(ref);
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateCharList();
  }

  updateCharList = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharsLoaded)
      .catch(this.onError);
  }

  handleMoreBtn = (offset) => (e) => {
    this.updateCharList(offset);
  };

  onCharListLoading = () => {
    this.setState({ newCharsState: 'loading' });
  };

  onCharsLoaded = (newChars) => {
    this.setState(({ chars, offset }) => ({
      chars: [...chars, ...newChars],
      process: 'completed',
      newCharsState: (newChars.length < 9) ? 'ended' : 'completed',
      offset: offset + 9,
    }));
  };

  onError = () => {
    this.setState({
      process: 'error',
    });
  };

  getContent = (process, chars) => {
    switch (process) {
      case 'loading':
        return <Spinner />;
      case 'completed':
        return this.renderItems(chars);
      case 'error':
        return <ErrorMessage />
      default:
        throw new Error('Unexpected process state');
    }
  }

  handleSelectedChar = (id) => (e) => {
    const { onSelectedChar } = this.props;
    onSelectedChar(id);

    this.itemRefs.forEach((item) => item.classList.remove('char__item_selected'));
    const currentRefChar = this.itemRefs.find((i) => i.id === `${id}`);
    currentRefChar.classList.add('char__item_selected');
  };

  renderItems(chars) {
    const items = chars.map(({ name, thumbnail, id }) => {
      const isAvailableTumbnail = thumbnail.indexOf('image_not_available') === -1;
      const stylesThumbnail = {
        objectFit: isAvailableTumbnail ? 'cover' : 'unset',
      };

      return (
        <li id={id} ref={this.setRef} key={id} className='char__item' onClick={this.handleSelectedChar(id)} tabIndex="0" >
          <img src={thumbnail} alt={name} style={stylesThumbnail} />
          <div className='char__name'>{name}</div>
        </li>
      )
    });

    return (
      <ul className='char__grid'>
        {items}
      </ul>
    )
  }

  render() {
    const { chars, process, newCharsState, offset } = this.state;
    return (
      <div className='char__list'>
        {this.getContent(process, chars)}
        <button 
          className='button button__main button__long' 
          onClick={this.handleMoreBtn(offset)}
          disabled={newCharsState === 'loading'}
          style={{ display: (newCharsState === 'ended') ? 'none' : 'block'  }}
        >
          <div className='inner'>load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onSelectedChar: PropTypes.func.isRequired,
};

export default CharList;
