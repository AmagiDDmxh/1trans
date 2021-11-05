# Translator

A DeepL translator script

## How to use

Using nodejs as runtime.

```bash
npm i -g @onekey/1trans

# Translate test-en.json to Chinease and output as `./output-zh.json`
DEEPL_API_TOKEN=[your deepl token] && 1trans ./test-en.json ./output-zh.json -t zh
```

Use the script locally.

```bash
git clone https://github.com/AmagiDDmxh/translator
cd translator
yarn
# 复制 env，编辑 'DEEPL_API_TOKEN=' 属性为 DeepL API token
cp .env.example .env

# 尝试翻译 test-en.json 中文 翻译好的文件会输出到 `output/test-zh.json`
yarn start test-en.json -t zh

# 尝试翻译 input.json 德语
yarn start input.json -t de
```

## TODO

- [ ] Add placeholder supports
  - [ ] [%s]
  - [ ] [%d]
  - [ ] HTML Tag </>
  - [ ] format \{aaa\}
