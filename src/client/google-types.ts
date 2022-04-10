export interface SearchResult {
  kind: string
  url: Url
  queries: Queries
  context: Context
  searchInformation: SearchInformation
  items: Item[]
}

export interface Url {
  type: string
  template: string
}

export interface Queries {
  request: Request[]
  nextPage: NextPage[]
}

export interface Request {
  title: string
  totalResults: string
  searchTerms: string
  count: number
  startIndex: number
  inputEncoding: string
  outputEncoding: string
  safe: string
  cx: string
}

export interface NextPage {
  title: string
  totalResults: string
  searchTerms: string
  count: number
  startIndex: number
  inputEncoding: string
  outputEncoding: string
  safe: string
  cx: string
}

export interface Context {
  title: string
}

export interface SearchInformation {
  searchTime: number
  formattedSearchTime: string
  totalResults: string
  formattedTotalResults: string
}

export interface Item {
  kind: string
  title: string
  htmlTitle: string
  link: string
  displayLink: string
  snippet: string
  htmlSnippet: string
  cacheId?: string
  formattedUrl: string
  htmlFormattedUrl: string
  pagemap: Pagemap
}

export interface Pagemap {
  cse_thumbnail: CseThumbnail[]
  metatags: Metatag[]
  cse_image: CseImage[]
}

export interface CseThumbnail {
  src: string
  width: string
  height: string
}

export interface Metatag {
  "next-head-count"?: string
  "og:image"?: string
  "og:type"?: string
  ssr?: string
  "og:site_name"?: string
  viewport: string
  "og:title"?: string
  "og:url"?: string
  "og:description"?: string
  dd_locale?: string
  "apple-mobile-web-app-title"?: string
  "mobile-web-app-capable"?: string
}

export interface CseImage {
  src: string
}