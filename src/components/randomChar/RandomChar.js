import { useState, useEffect } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
  const [char, setChar] = useState({});
  const [process, setProcess] = useState('loading');

  useEffect(() => {
    updateChar();
    const timerId = setInterval(updateChar, 60000);

    return () => {
      clearInterval(timerId)
    }
  }, []);

  const marvelService = new MarvelService();

  const onCharLoaded = (char) => {
    setChar(char);
    setProcess('completed');
  };

  const onCharLoading = () => {
    setProcess('loading');
  };

  const onError = () => {
    setProcess('error');
  };

  const updateChar = () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    onCharLoading();
    marvelService.getCharacter(id).then(onCharLoaded).catch(onError);
  };

  const getContent = (process, char) => {
    switch (process) {
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

  return (
    <div className='randomchar'>
      {getContent(process, char)}
      <div className='randomchar__static'>
        <p className='randomchar__title'>
          Random character for today!
          <br />
          Do you want to get to know him better?
        </p>
        <p className='randomchar__title'>Or choose another one</p>
        <button className='button button__main' onClick={updateChar}>
          <div className='inner'>try it</div>
        </button>
        <img src={mjolnir} alt='mjolnir' className='randomchar__decoration' />
      </div>
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;

  const isAvailableTumbnail = thumbnail.indexOf('image_not_available') === -1;
  const stylesThumbnail = {
    objectFit: isAvailableTumbnail ? 'cover' : 'contain',
  };
  // let imgStyle = {'objectFit' : 'cover'};
  //   if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
  //       imgStyle = {'objectFit' : 'contain'};
  //   }

  return (
    <div className='randomchar__block'>
      <img
        src={thumbnail}
        alt='Random character'
        className='randomchar__img'
        style={stylesThumbnail}
      />
      <div className='randomchar__info'>
        <p className='randomchar__name'>{name}</p>
        <p className='randomchar__descr'>{description}</p>
        <div className='randomchar__btns'>
          <a
            href={homepage}
            className='button button__main'
            target='_blank'
            rel='noreferrer'
          >
            <div className='inner'>homepage</div>
          </a>
          <a
            href={wiki}
            className='button button__secondary'
            target='_blank'
            rel='noreferrer'
          >
            <div className='inner'>Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
