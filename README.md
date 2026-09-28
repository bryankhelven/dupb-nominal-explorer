# DUPB Nominal Explorer

Interface web para consulta de nomes e predicação por acepção no **Dicionário de usos do português do Brasil** (Francisco S. Borba, Ática, 2002).

## Recurso

A versão publicada contém:

- **33.518** nomes;
- **55.792** acepções;
- **7.007** acepções predicadoras;
- **48.785** acepções não predicadoras.

A numeração das acepções pertence ao DUPB.

## Funcionalidades

- busca incremental por nome e conteúdo das acepções;
- filtros por perfil do nome;
- exibição de todas as acepções, apenas predicadoras ou apenas não predicadoras;
- navegação alfabética;
- tema claro/escuro;
- URL compartilhável por lema;
- ficha lexical por nome;
- exportação JSON/JSONL;
- página de estatísticas;
- dados e citação.

## Autoria e contato

**Bryan Khelven**  
bryankhelven@ieee.org

## GitHub Pages

O repositório contém um workflow em `.github/workflows/deploy-pages.yml`.

Após habilitar **Settings → Pages → Source → GitHub Actions**, todo push para `main` publica automaticamente o site.

## Valências

As valências nominais não fazem parte desta versão. A interface está preparada para incorporá-las quando a authority correspondente for concluída.

## Dados

Os arquivos científicos usados pela interface são os mesmos da release congelada do recurso. Alterações na camada web não devem alterar os dados linguísticos sem uma nova versão científica.
