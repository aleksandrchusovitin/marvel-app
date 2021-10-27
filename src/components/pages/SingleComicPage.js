import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './singleComicPage.scss';

const SingleComicPage = () => {
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);

  const { process, getComic } = useMarvelService();

  useEffect(() => {
    updateComic();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comicId]);

  const updateComic = () => {
    getComic(comicId).then(onComicLoaded);
  };

  const onComicLoaded = (comic) => {
    setComic(comic);
  };

  const getContent = (process, comic) => {
    switch (process) {
      case 'waiting':
      case 'loading':
        return <Spinner />;
      case 'completed':
        return comic? <View comic={comic} /> : null;
      case 'error':
        return <ErrorMessage />;
      default:
        throw new Error('Unexpected process state');
    }
  };

  return <>{getContent(process, comic)}</>;
};

const View = ({ comic }) => {
  const { title, description, pageCount, thumbnail, language, price } = comic;

  return (
    <div className='single-comic'>
      <img src={thumbnail} alt={title} className='single-comic__img' />
      <div className='single-comic__info'>
        <h2 className='single-comic__name'>{title}</h2>
        <p className='single-comic__descr'>{description}</p>
        <p className='single-comic__descr'>{pageCount}</p>
        <p className='single-comic__descr'>Language: {language}</p>
        <div className='single-comic__price'>{price}</div>
      </div>
      <Link to='/comics' className='single-comic__back'>
        Back to all
      </Link>
    </div>
  );
};

export default SingleComicPage;
