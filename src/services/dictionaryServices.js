import http from "../utils/http";

export async function checkDictionary(word) {
  const URI = "/word-checker";
  const formattedData = { word };
  const data = await http.post(URI, formattedData);

  return data;
}
