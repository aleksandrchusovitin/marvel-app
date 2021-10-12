import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
  state = {
    char: {},
    process: 'waiting',
  };

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps, prevState) {
    const { charId } = this.props;
    if (charId !== prevProps.charId) {
      this.updateChar();
    }
  }

  marvelService = new MarvelService();

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) {
      return;
    }

    this.onCharLoading();
    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  onCharLoaded = (char) => {
    this.setState({
      char,
      process: 'completed',
    });
  };

  onCharLoading = () => {
    this.setState({
      process: 'loading',
    });
  };

  onError = () => {
    this.setState({
      process: 'error',
    });
  };

  getContent = (process, char) => {
    switch (process) {
      case 'waiting':
        return <Skeleton />;
      case 'loading':
        return <Spinner />;
      case 'completed':
        return <View char={char} />;
      case 'error':
        return <ErrorMessage />;
      default:
        throw new Error('Unexpected process state');
    }
  };

  render() {
    const { process, char } = this.state;
    return <div className='char__info'>{this.getContent(process, char)}</div>;
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;

  const isAvailableTumbnail = thumbnail.indexOf('image_not_available') === -1;
  const stylesThumbnail = {
    objectFit: isAvailableTumbnail ? 'cover' : 'contain',
  };

  const renderComics = () => {
    if (comics.length === 0) {
      return <h3>There is no comics with this character</h3>;
    }

    return (
      <>
        <div className='char__comics'>Comics:</div>
        <ul className='char__comics-list'>
          {comics.map((comic, i) => {
            if (i > 9) {
              // eslint-disable-next-line
              return;
            }

            const comicName = comic.name;

            return <li key={i} className='char__comics-item'>{comicName}</li>;
          })}
        </ul>
      </>
    );
  };

  return (
    <>
      <div className='char__basics'>
        <img src={thumbnail} alt={name} style={stylesThumbnail} />
        <div>
          <div className='char__info-name'>{name}</div>
          <div className='char__btns'>
            <a href={homepage} className='button button__main'>
              <div className='inner'>homepage</div>
            </a>
            <a href={wiki} className='button button__secondary'>
              <div className='inner'>Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className='char__descr'>{description}</div>
      {renderComics()}
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
