import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {
  const [comics, setComics] = useState([]);
  const [newComicsState, setNewComicsState] = useState('loading');
  const [offset, setOffset] = useState(0);

  const { process, getAllComics } = useMarvelService();

  useEffect(() => {
    updateComicsList(offset, true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateComicsList = (offset, initial) => {
    initial ? setNewComicsState('waiting') : setNewComicsState('loading');
    getAllComics(offset).then(onComicsLoaded);
  };

  const handleMoreBtn = (offset) => (e) => {
    updateComicsList(offset);
  };

  const onComicsLoaded = (newComics) => {
    setComics((comics) => [...comics, ...newComics]);
    setNewComicsState(newComics.length < 8 ? 'ended' : 'completed');
    setOffset((offset) => offset + 8);
  };

  const getContent = (process) => {
    switch (process) {
      case 'waiting':
      case 'loading':
        return newComicsState === 'waiting' ? <Spinner /> : renderItems(comics);
      case 'completed':
        return renderItems(comics);
      case 'error':
        return <ErrorMessage />;
      default:
        throw new Error('Unexpected process state');
    }
  };

  function renderItems(comics) {
    const items = comics.map(({ id, title, price, thumbnail }, i) => {
      const isAvailablethumbnail =
        thumbnail.indexOf('image_not_available') === -1;
      const stylesThumbnail = {
        objectFit: isAvailablethumbnail ? 'cover' : 'unset',
      };

      return (
        <li id={id} key={i} className='comics__item' tabIndex='0'>
          <Link to={`/comics/${id}`}>
            <img
              src={thumbnail}
              alt={title}
              className='comics__item-img'
              style={stylesThumbnail}
            />
            <div className='comics__item-name'>{title}</div>
            <div className='comics__item-price'>{price}</div>
          </Link>
        </li>
      );
    });

    return <ul className='comics__grid'>{items}</ul>;
  }
  return (
    <div className='comics__list'>
      {getContent(process, comics)}
      <button
        className='button button__main button__long'
        onClick={handleMoreBtn(offset)}
        disabled={newComicsState === 'loading'}
        style={{ display: newComicsState === 'ended' ? 'none' : 'block' }}
      >
        <div className='inner'>load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
