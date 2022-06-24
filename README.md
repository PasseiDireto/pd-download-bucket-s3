<h1 align="center">Welcome to S3 Download 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

> Exemplo de script para download de objetos de alguns buckets do s3

## Requirements

- [NodeJS](https://nodejs.org/) 16.15.1+

## Installation

- `npm i` - Para instalar as dependências
- `npm link` - Para instalar a lib

## Usage

```sh
s3-download
```

Opções de filtro:
  -e, --environment <env>  ambiente que quer baixar os dados (dev or prod) (default: "prod")
  -sd, --startDate <date>  data que quer iniciar os downloads. Formato: YYYY/MM/DD (default: "6/13/2022")
  -ed, --endDate <date>    data que quer finalizar os downloads Formato: YYYY/MM/DD (default: "6/20/2022")

Se tiver alguma dúvida utilize o comando:
  -h, --help               mostra todos os comandos disponíveis


- Ao executar o comando acima o script buscará todos os objetos no bucket do ambiente especificado;
- Depois de buscar quais são estes objetos o script irá baixar e salvar os arquivos na pasta ./downloads;
- O script salva um a um e por isso, conforme a quantidade de arquivos, é normal que o script leve um tempo considerável executando;
- Ao final da execução o script mostra os arquivos que obtiveram erro neste processo, caso aconteça.

## Troubleshooting

É possível que a lib globamente instalada perca a referência a pasta local, neste caso basta executar novamente o comando `npm link` 


## Author

👤 **SRE**


***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_