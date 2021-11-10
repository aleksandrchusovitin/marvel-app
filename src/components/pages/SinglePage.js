import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from '../appBanner/AppBanner';

const SinglePage = ({ Component, dataType }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { process, getComic, getCharacter } = useMarvelService();

  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateData = () => {
    switch (dataType) {
      case 'comic':
        getComic(id).then(onDataLoaded);
        break;
      case 'character':
        getCharacter(id).then(onDataLoaded);
        break;
      default:
        throw new Error(`unknown datatype: ${dataType}`);
    }
  };

  const onDataLoaded = (data) => {
    setData(data);
  };

  const getContent = (process, data) => {
    switch (process) {
      case 'waiting':
      case 'loading':
        return <Spinner />;
      case 'completed':
        return data? <Component data={data} /> : null;
      case 'error':
        return <ErrorMessage />;
      default:
        throw new Error(`Unexpected process state: ${process}`);
    }
  };

  return (
    <>
      <AppBanner />
      {getContent(process, data)}
    </>
  );
};

export default SinglePage;
