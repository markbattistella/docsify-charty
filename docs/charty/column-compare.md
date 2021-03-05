```charty
{
  "title":  "Labels and numbers",
  "config": {
    "type":    "column-compare",
    "labels":  true,
    "numbers": true
  },
  "data": [
    { "label": "2010", "value": 10, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 50, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 28, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 89, "color": "var(--mb-colour-yellow)" }
  ]
}
```

```charty
{
  "title":  "Labels, no numbers",
  "config": {
    "type":    "column-compare",
    "labels":  true,
    "numbers": false
  },
  "data": [
    { "label": "2010", "value": 10, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 50, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 28, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 89, "color": "var(--mb-colour-yellow)" }
  ]
}
```

```charty
{
  "title":  "No labels or numbers",
  "config": {
    "type":    "column-compare",
    "labels":  false,
    "numbers": false
  },
  "data": [
    { "label": "2010", "value": 10, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 50, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 28, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 89, "color": "var(--mb-colour-yellow)" }
  ]
}
```
