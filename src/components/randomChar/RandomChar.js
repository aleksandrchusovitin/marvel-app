import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
  constructor(props) {
    super(props);
    this.updateChar();
  }

  state = {
    char: {},
    process: 'loading',
  };

  marvelService = new MarvelService();

  onCharLoaded = (char) => {
    this.setState({ 
      char,
      process: 'completed',
    });
  };

  onError = () => {
    this.setState({ 
      process: 'error',
    });
  };

  updateChar = () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    this.marvelService
      .getCharacter(id)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  getContent = (process, char) => {
    switch (process) {
      case 'loading':
        return <Spinner />;
      case 'completed':
        return <View char={char} />
      case 'error':
        return <ErrorMessage />
      default:
        throw new Error('Unexpected process state');
    }
  }

  render() {
    const { char, process } = this.state;

    return (
      <div className='randomchar'>
        {this.getContent(process, char)}
        <div className='randomchar__static'>
          <p className='randomchar__title'>
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className='randomchar__title'>Or choose another one</p>
          <button className='button button__main' onClick={this.updateChar} >
            <div className='inner'>try it</div>
          </button>
          <img src={mjolnir} alt='mjolnir' className='randomchar__decoration' />
        </div>
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  console.log(name)

  return (
    <div className='randomchar__block'>
          <img src={thumbnail} alt='Random character' className='randomchar__img' />
          <div className='randomchar__info'>
            <p className='randomchar__name'>{name}</p>
            <p className='randomchar__descr'>{description}</p>
            <div className='randomchar__btns'>
              <a href={homepage} className='button button__main'>
                <div className='inner'>homepage</div>
              </a>
              <a href={wiki} className='button button__secondary'>
                <div className='inner'>Wiki</div>
              </a>
            </div>
          </div>
        </div>
  );
};

export default RandomChar;
