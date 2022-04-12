import { PendingOption } from "../models";
import * as gt from "./google-types";

const itemToOption = (item: gt.Item): PendingOption => ({
  name: item.title,
  uri: item.link,
  description: item.snippet,
  img: item.pagemap?.cse_image?.[0]?.src, // TODO: Default
})

export class GoogleSearchClient {
  private token: string;
  constructor(token = "TODO") {
    this.token = token;
  }

  async search(term: string, start = 0) {
    const apiKey = "AIzaSyAyYnZEwYr5DYU1Gtmmib_NEYZ9WPET8Dw";
    const caviarCx = "6bb8b229698a51c79"; // NOTE: we will have multiple ctx's in the future
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${caviarCx}&q=${term}&start=${start}`;

    const res = await fetch(url);
    const json = await res.json();

    const mapped = json.items.map((item: gt.Item) => itemToOption(item));
    console.log(mapped);

    return { items: mapped as PendingOption[] };
  }
}

const googleSearch = new GoogleSearchClient();

export default googleSearch;
