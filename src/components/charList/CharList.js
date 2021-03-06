import {CSSTransition, TransitionGroup} from 'react-transition-group';

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = ({ onSelectedChar }) => {
  const [chars, setChars] = useState([]);
  const [newCharsState, setNewCharsState] = useState('loading');
  const [offset, setOffset] = useState(210);

  const { process, getAllCharacters } = useMarvelService();

  const itemRefs = useRef([]);

  useEffect(() => {
    updateCharList(offset, true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCharList = (offset, initial) => {
    initial ? setNewCharsState('waiting') : setNewCharsState('loading');
    getAllCharacters(offset).then(onCharsLoaded);
  };

  const handleMoreBtn = (offset) => (e) => {
    updateCharList(offset);
  };

  const onCharsLoaded = (newChars) => {
    setChars((chars) => [...chars, ...newChars]);
    setNewCharsState(newChars.length < 9 ? 'ended' : 'completed');
    setOffset((offset) => offset + 9);
  };

  const getContent = (process, chars) => {
    switch (process) {
      case 'waiting':
      case 'loading':
        return newCharsState === 'waiting' ? <Spinner /> : renderItems(chars);
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
        <CSSTransition key={id} timeout={500} classNames="char__item">
          <li
            id={id}
            ref={(el) => (itemRefs.current[i] = el)}
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
        </CSSTransition>
      );
    });

    return (
      <ul className='char__grid'>
        <TransitionGroup component={null}>
          {items}
        </TransitionGroup>
      </ul>
    );
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
