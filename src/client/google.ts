import { Option } from "../models";
import * as gt from "./google-types";

const itemToOption = (item: gt.Item): Option => ({
  name: item.title,
  uri: item.link,
  description: item.snippet,
  img: item.pagemap.cse_image[0].src,
})

export class GoogleSearchClient {
  private token: string;
  constructor(token = "TODO") {
    this.token = token;
  }

  async search(term: string) {
    const apiKey = "AIzaSyAyYnZEwYr5DYU1Gtmmib_NEYZ9WPET8Dw";
    const cx = "6bb8b229698a51c79"; // NOTE: we can enable general web search and maube rename th
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${term}`;

    const res = await fetch(url);
    const json = await res.json();

    const mapped = json.items.map((item: gt.Item) => itemToOption(item));
    console.log(mapped);

    return { items: mapped as Option[] };
  }
}

const googleSearch = new GoogleSearchClient();

export default googleSearch;
