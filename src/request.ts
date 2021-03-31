import axios, { AxiosInstance } from "axios";
import { DEEPL_API_URL, LANGUAGES } from "./constants";
import { log } from "./utils";

// Use for testing
import dotenv from "dotenv";
dotenv.config();
const { DEEPL_API_TOKEN } = process.env;

export interface TranslateParams {
  text: string;
  from?: string;
  to?: string;
  // rest...
}

export interface TranslationResponse {
  translations: Translation[];
}

export interface Translation {
  detected_source_language: string;
  text: string;
}

const HEADERS = {
  Connection: "keep-alive",
  Accept: "*/*",
  "User-Agent": "YourApp",
};

export default class Requester {
  #TOKEN: string;
  instance: AxiosInstance;

  constructor(token: string, config?: {}) {
    this.#TOKEN = token;

    this.instance = axios.create({
      ...config,
      headers: HEADERS,
      proxy: false,
    });
    // Add auth token
    this.instance.interceptors.request.use((config) => {
      const authorizedData = {
        ...config.params,
        auth_key: token,
      };

      return {
        ...config,
        params: authorizedData,
      };
    });
  }

  translate = async ({
    text,
    from,
    to,
  }: TranslateParams): Promise<TranslationResponse | undefined> => {
    const data = {
      text: text,
      source_lang: from,
      target_lang: to,
    };

    try {
      const response = await this.instance.get(`${DEEPL_API_URL}/translate`, {
        params: data,
      });

      return response.data;
    } catch (e) {
      // log("ERROR on translating text", text);
      // const errorKeys = Object.keys(e);
      // log("ERROR", errorKeys);
      if (e.hasOwnProperty("response")) {
        const result = e.toJSON();
        log(Object.keys(e.response));
        log("response:", result, result.message);
      }
    }
  };

  checkLimits = async () => {
    try {
      const response = await this.instance.get(`${DEEPL_API_URL}/usage`);
      return response.data;
    } catch (e) {
      log("ERROR on check limits", e);
    }
  };

  getAvailableLanguages = async () => {};
}

// const requester = new Requester(DEEPL_API_TOKEN!);
// requester
//   .translate({
//     text: `额度低于最小值 ({dust}),l1
//   有足够的 {symbol} 来支付交易费用,l3`,
//     from: LANGUAGES.chinese,
//     to: LANGUAGES.englishAmerican,
//   })
//   .then(log)
//   .catch(log);

// requester.checkLimits().then(log).catch(log);
