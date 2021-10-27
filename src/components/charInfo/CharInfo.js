import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = ({ charId }) => {
  const [char, setChar] = useState({});
  const { process, getCharacter } = useMarvelService();

  useEffect(() => {
    updateChar();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charId]);


  const updateChar = () => {
    if (!charId) {
      return;
    }

    getCharacter(charId).then(onCharLoaded);
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const getContent = (process, char) => {
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

  return <div className='char__info'>{getContent(process, char)}</div>;
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;

  let stylesThumbnail;
  if (thumbnail) {
    const isAvailableTumbnail = thumbnail.indexOf('image_not_available') === -1;
    stylesThumbnail = {
      objectFit: isAvailableTumbnail ? 'cover' : 'contain',
    };
  }

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

            return (
              <li key={i} className='char__comics-item'>
                {comicName}
              </li>
            );
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
      {comics && renderComics()}
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
