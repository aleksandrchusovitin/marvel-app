import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './singleCharacterLayout.scss';

const SingleCharacterLayout = ({ data }) => {
  const { name, description, thumbnail } = data;

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content={`${name} character page`}
        />
        <title>{name}</title>
      </Helmet>
      <div className='single-character'>
        <img src={thumbnail} alt={name} className='single-character__char-img' />
        <div className='single-character__info'>
          <h2 className='single-character__name'>{name}</h2>
          <p className='single-character__descr'>{description}</p>
        </div>
        <Link to='/' className='single-character__back'>
          Back to homepage
        </Link>
      </div>
    </>
  );
};

export default SingleCharacterLayout;
