# Drop Folder — Artigos de Fontes Bloqueadas

Cole aqui artigos copiados manualmente de fontes que bloqueiam scraping (Seeking Alpha, Investopedia, Financial Times, Gavekal).

O agente vai:
1. Ler os arquivos desta pasta
2. Reescrever cada artigo no estilo Dinheirologia (com rewrite completo, igual RSS)
3. Traduzir, buscar imagem, publicar
4. **Deletar o arquivo original apos processamento**

## Formato do Arquivo

Cada arquivo deve ser `.md` ou `.txt` com este formato:

```
FONTE: Financial Times
TITULO: The AI Investment Boom Shows No Signs of Slowing
CATEGORIA: mercados
TIPO: artigo

<corpo do artigo aqui em texto plain/markdown>
```

### Campos do Header

| Campo      | Obrigatorio | Valores                                              |
|------------|-------------|------------------------------------------------------|
| FONTE      | Nao*        | Nome da fonte (ex: "Financial Times", "Seeking Alpha")|
| TITULO     | **Sim**     | Titulo original do artigo                            |
| CATEGORIA  | Nao         | mercados, trading, investimentos, negocios, opiniao  |
| TIPO       | Nao         | artigo, noticia                                      |

*Se o arquivo estiver numa subpasta (ex: `ft/`, `seeking-alpha/`), FONTE e inferida automaticamente.

### Regras

- O header e separado do corpo por **uma linha em branco**
- O corpo pode ser em ingles ou portugues — o agente traduz e reescreve
- O nome do arquivo nao importa (pode ser qualquer coisa)
- Extensao `.md` ou `.txt`
- Artigos sem TITULO no header serao ignorados com warning

## Subpastas

Cada subpasta tem defaults automaticos:

| Pasta           | Fonte            | Categoria     | Tipo   | Idioma |
|-----------------|------------------|---------------|--------|--------|
| `seeking-alpha/`| Seeking Alpha    | investimentos | artigo | en     |
| `investopedia/` | Investopedia     | investimentos | artigo | en     |
| `ft/`           | Financial Times  | mercados      | artigo | en     |
| `gavekal/`      | Gavekal Research | mercados      | artigo | en     |

Voce tambem pode colocar arquivos direto na raiz desta pasta — nesse caso, inclua o header FONTE.
