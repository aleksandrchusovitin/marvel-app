import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = ({ onSelectedChar }) => {
  const [chars, setChars] = useState([]);
  const [process, setProcess] = useState('loading');
  const [newCharsState, setNewCharsState] = useState('loading');
  const [offset, setOffset] = useState(210);

  const itemRefs = useRef([]);

  const marvelService = useMarvelService();

  useEffect(() => {
    updateCharList();
  }, []);

  const updateCharList = (offset) => {
    onCharListLoading();
    marvelService.getAllCharacters(offset).then(onCharsLoaded).catch(onError);
  };

  const handleMoreBtn = (offset) => (e) => {
    updateCharList(offset);
  };

  const onCharListLoading = () => {
    setNewCharsState('loading');
  };

  const onCharsLoaded = (newChars) => {
    setChars((chars) => [...chars, ...newChars]);
    setProcess('completed');
    setNewCharsState(newChars.length < 9 ? 'ended' : 'completed');
    setOffset((offset) => offset + 9);
  };

  const onError = () => {
    setProcess('error');
  };

  const getContent = (process, chars) => {
    switch (process) {
      case 'loading':
        return <Spinner />;
      case 'completed':
        return renderItems(chars);
      case 'error':
        return <ErrorMessage />;
      default:
        throw new Error('Unexpected process state');
    }
  };

  const handleSelectedChar = (id) => (e) => {
    onSelectedChar(id);

    itemRefs.current.forEach((item) =>
      item.classList.remove('char__item_selected')
    );
    const currentRefChar = itemRefs.current.find((i) => i.id === `${id}`);
    currentRefChar.classList.add('char__item_selected');
  };

  function renderItems(chars) {
    const items = chars.map(({ name, thumbnail, id }, i) => {
      const isAvailableTumbnail =
        thumbnail.indexOf('image_not_available') === -1;
      const stylesThumbnail = {
        objectFit: isAvailableTumbnail ? 'cover' : 'unset',
      };

      return (
        <li
          id={id}
          ref={(el) => (itemRefs.current[i] = el)}
          key={id}
          className='char__item'
          onClick={handleSelectedChar(id)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSelectedChar(id)(e);
            }
          }}
          tabIndex='0'
        >
          <img src={thumbnail} alt={name} style={stylesThumbnail} />
          <div className='char__name'>{name}</div>
        </li>
      );
    });

    return <ul className='char__grid'>{items}</ul>;
  }

  return (
    <div className='char__list'>
      {getContent(process, chars)}
      <button
        className='button button__main button__long'
        onClick={handleMoreBtn(offset)}
        disabled={newCharsState === 'loading'}
        style={{ display: newCharsState === 'ended' ? 'none' : 'block' }}
      >
        <div className='inner'>load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onSelectedChar: PropTypes.func.isRequired,
};

export default CharList;
