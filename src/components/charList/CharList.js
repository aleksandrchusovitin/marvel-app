import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
  state = {
    chars: [],
    process: 'loading',
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChars();
  }

  updateChars = () => {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharsLoaded)
      .catch(this.onError);
  };

  onCharsLoaded = (chars) => {
      this.setState({
      chars,
      process: 'completed',
    });
  };

  onError = () => {
    this.setState({
      process: 'error',
    });
  };

  getContent = (process, chars) => {
    console.log(process);
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

  renderItems(chars) {
    const items = chars.map(({ name, thumbnail, id }) => {
      const isAvailableTumbnail = thumbnail.indexOf('image_not_available') === -1;
      const stylesThumbnail = {
        objectFit: isAvailableTumbnail ? 'cover' : 'contain',
      };

      return (
        <li key={id} className='char__item'>
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
    const { chars, process } = this.state;
    return (
      <div className='char__list'>
        {this.getContent(process, chars)}
        <button className='button button__main button__long'>
          <div className='inner'>load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
