import { PendingOption } from "../models";
import { GOOGLE_API_KEY } from "../consts";
import * as gt from "./google-types";

const cleanTitle = (unclean: string): string => {
  const parts = unclean.split(/[(|]/);

  return parts[0];
}

const itemToOption = (item: gt.Item): PendingOption<gt.Item> => ({
  name: cleanTitle(item.title),
  uri: item.link,
  description: item.snippet,
  img: item.pagemap?.cse_image?.[0]?.src, // TODO: Default
  original: item,
})

export class GoogleSearchClient {
  private token: string;
  constructor(token = GOOGLE_API_KEY) {
    this.token = token;
  }

  async search(term: string, start = 0) {
    const caviarCx = "6bb8b229698a51c79"; // NOTE: we will have multiple ctx's in the future
    const url = `https://www.googleapis.com/customsearch/v1?key=${this.token}&cx=${caviarCx}&q=${term}&start=${start}`;

    const res = await fetch(url);
    const json = await res.json();

    const mapped = json.items.map((item: gt.Item) => itemToOption(item));

    return { items: mapped as PendingOption[] };
  }
}

const googleSearch = new GoogleSearchClient();

export default googleSearch;
