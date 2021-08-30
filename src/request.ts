import axios, { AxiosInstance } from "axios";
import FormData from 'form-data'
import { DEEPL_API_URL, LANGUAGES } from "./constants";
import { log } from "./utils";

export interface TranslateParams {
  text: string;
  to: string;
  from?: string;
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
};

export default class Requester {
  #TOKEN: string;
  instance: AxiosInstance;

  constructor(token: string, config?: {}) {
    this.#TOKEN = token;

    this.instance = axios.create({
      ...config,
      headers: {
        ...HEADERS,
        Authorization: `DeepL-Auth-Key ${token}`
      },
      proxy: false,
    });
  }

  translate = async ({
    text,
    from,
    to,
  }: TranslateParams): Promise<TranslationResponse | undefined> => {
    const formData = new FormData()
    formData.append('text', text)
    formData.append('target_lang', to)
    if (from) {
      formData.append('source_lang', from)
    }

    // const data = {
    //   text,
    //   target_lang: to,
    //   source_lang: from
    // }

    try {
      const response = await this.instance.post(
        `${DEEPL_API_URL}/translate`,
        formData,
        {
          headers: {
            ...this.instance.defaults.headers,
            ...formData.getHeaders()
          }
        }
      );
      return response.data;
    } catch (e) {
      // log("ERROR on translating text", text);
      // const errorKeys = Object.keys(e);
      // log("ERROR", errorKeys);
      if (e.hasOwnProperty("response")) {
        const result = e.toJSON();
        // log(Object.keys(e.response));
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

  getAvailableLanguages = async () => { };
}


// Use for testing only
// import dotenv from "dotenv";
// dotenv.config();
// const { DEEPL_API_TOKEN } = process.env;

// const requester = new Requester(DEEPL_API_TOKEN!);
// requester
//   .translate({
//     text: `额度低于最小值 ({dust}),l1
//   有足够的 {symbol} 来支付交易费用,l3`,
//     from: LANGUAGES.chinese,
//     to: LANGUAGES.english,
//   })
//   .then(log)
//   .catch(log);

// requester.checkLimits().then(log).catch(log);
