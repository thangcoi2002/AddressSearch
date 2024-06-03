import axios from 'axios';

const defaultUrl = 'https://geocode.search.hereapi.com/v1/';
const apiKey = 'cSwtw30B-XCt3FbIAFc2naIesb9WlybLw5Z3aD8ddZM';

export const geocode = async ({search}) => {
  try {
    const res = await axios.get(`${defaultUrl}geocode`, {
      params: {
        q: search,
        apiKey: apiKey,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

export const autosuggest = async ({search, at}) => {
  try {
    const res = await axios.get(`${defaultUrl}autosuggest`, {
      params: {q: search, at: at, apiKey: apiKey},
    });
    return res;
  } catch (error) {
    return error;
  }
};
