import { useHttp } from '../hooks/http.hook.js';

const useMarvelService =() => {
  const { process, error, request } = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=15662d93bc28bdbc738e3f2f1a54ee4e';
  const _baseOffset = 210;

  const getAllCharacters = async (offset = _baseOffset) => {
      const res = await request({ url: `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}` });
      return res.data.results.map(_transformCharacter);
  }

  const getCharacter = async (id) => {
      const res = await request({ url: `${_apiBase}characters/${id}?${_apiKey}` });
      return _transformCharacter(res.data.results[0]);
  }

  const getAllComics = async (offset = 0) => {
    const res = await request({ url: `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}` });
    return res.data.results.map(_transformComic);
  }

  const getComic = async (id) => {
    const res = await request({ url: `${_apiBase}comics/${id}?${_apiKey}` });
    return _transformComic(res.data.results[0]);
  }

  const _transformComic = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      price: comic.prices.price ?? 'not available',
      description: comic.description || 'There is no description',
      pageCount: comic.pageCount ? `${comic.pageCount} p.` : 'No information about the number of pages',
      thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
      language: comic.textObjects.language || 'en-us',
    };
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: (char.name.length > 20) ? `${char.name.slice(0, 20)}...` : char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  }

  return { process, error, getAllCharacters, getCharacter, getAllComics, getComic };
}

export default useMarvelService;