# DUPB Nominal Explorer: contrato público de dados

Os arquivos públicos contêm apenas informação linguística e identificadores públicos estáveis.

## Acepção

Cada acepção contém:
sense_id
sense
description
predicator
predicator_label

Acepções predicadoras também contêm:
valency
argument_structure
arguments

## Argumento

Cada argumento contém:
arg_slot
role_pt
semantic_definition

Os exports de argumentos acrescentam:
argument_id
sense_id
lemma
entry
sense
valency

## Identificadores

`sense_id` é um identificador público derivado de lema, entrada e número da acepção.
`argument_id` acrescenta o slot ARG ao `sense_id`.

Identificadores históricos baseados em linhas, blocos, unidades OCR ou locators internos não fazem parte do contrato público.

## Proveniência

A proveniência destinada ao leitor é apresentada na página Provenance em linguagem humana.

ORCH, SRC, nomes de lotes, authorities internas, localizadores, status de adjudicação, confidence de pipeline, registros brutos de decisão e demais metadados operacionais não fazem parte dos datasets públicos.

A trilha técnica completa é preservada somente nos pacotes privados de auditoria.
