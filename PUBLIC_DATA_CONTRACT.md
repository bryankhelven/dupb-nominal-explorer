# DUPB Nominal Explorer — contrato público JSON / JSONL

## Estrutura comum

```json
{
  "lemma": "acordo",
  "entry": 1,
  "sense": 3,
  "description": "...",
  "predicator": true,
  "valency": "V3",
  "argument_structure": "ARG0 || ARG1 || ARG2"
}
```

`valency` e `argument_structure` aparecem somente em acepções `predicator: true`.

## Valência

- `V1`, `V2`, `V3`, `V4`: número de posições argumentais da acepção.
- `argument_structure`: estrutura terminal congelada pela authority nominal de valência.
- Todas as 6.504 acepções predicadoras públicas possuem valência.
- A projeção pública é feita por identidade estável de sentido; não há matching por lema.

## Acepções não predicadoras

Acepções `predicator: false` não recebem `valency` nem `argument_structure`.

## JSON

O JSON agrupa as acepções por lema e por entrada lexicográfica.

## JSONL

O JSONL contém uma acepção por linha e inclui `lemma` e `entry`.
