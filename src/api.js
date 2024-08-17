import axios from "axios";

const API_URL = "https://cms.samespace.com/items/songs"

export const fetchSongs = async () => {
  const response = await axios.get(API_URL);
//  console.log(response);
  return response.data.data; 
};
