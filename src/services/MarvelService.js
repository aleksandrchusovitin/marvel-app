// import axios from "axios";

class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=15662d93bc28bdbc738e3f2f1a54ee4e';

  getResource = async (url) => {
      let res = await fetch(url);
  
      if (!res.ok) {
          throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }
  
      return await res.json();
  }

  // getResource = async (url) => {
  //   try {
  //     return await axios.get(url);
  //   } catch (e) {
  //     throw new Error(`Could not fetch ${url}, error: ${e}`);
  //   }
  // }

  getAllCharacters = async () => {
      const dataNormalize = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
      return dataNormalize.data.results.map(this._transformCharacter);
  }

  getCharacter = async (id) => {
      const dataNormalize = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
      return this._transformCharacter(dataNormalize.data.results[0]);
  }

  _transformCharacter = (char) => {
    return {
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
    };
  }
}

export default MarvelService;