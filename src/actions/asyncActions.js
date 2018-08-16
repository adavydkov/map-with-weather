import fetch from "isomorphic-fetch";

export function GETRequest(url) {
  return fetch(url, {
    method: "GET",
  });
}
