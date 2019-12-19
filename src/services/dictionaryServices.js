import http from '../utils/http';

export async function checkDictionary(word) {
  const URI = '/boggle';
  const formattedData = {word};
  const data = await http.post(URI, formattedData);
  
  return data;
}