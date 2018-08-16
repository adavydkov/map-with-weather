import { GETRequest } from "./asyncActions";

const SERVICE_URL = `http://maps.kosmosnimki.ru/rest/ver1/layers`;

const API_KEY = `6Q81IXBUQ7`;

const GEO_LAYER = "35FB2C338FED4B64B7A326FBFE54BE73";
const TEMP_LAYER = "11A381497B4A4AE4A4ED6580E1674B72";

/************** get gmx id geo point******************/
export const fetchGmxIdByGeoPoint = data => {
  const url = `${SERVICE_URL}/${GEO_LAYER}/search?query="lat"=${data.lat} and "lon"=${data.lon}&apikey=${API_KEY}`;

  return GETRequest(url)
    .then(response => response.json());
};

/************** get temp by gmx id ******************/
export const fetchTempByGmxId = gmx_id => {
  const url = `${SERVICE_URL}/${TEMP_LAYER}/search?query=year("date")>=2011 and "gridpoint_id"=${gmx_id}&orderby=date&apikey=${API_KEY}`;

  return GETRequest(url)
    .then(response => response.json());
};
