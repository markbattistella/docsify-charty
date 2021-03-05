```charty
{
  "title":  "Labels and numbers",
  "config": {
    "type":    "pie",
    "color":   "var(--mb-colour-blue)",
    "labels":  true,
    "numbers": true
  },
  "data": [
    { "label": "2012", "value": 1024, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 2048, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 4192, "color": "var(--mb-colour-yellow)" }
  ]
}
```

```charty
{
  "title":  "Labels, no numbers",
  "config": {
    "type":    "pie",
    "color":   "var(--mb-colour-blue)",
    "labels":  true,
    "numbers": false
  },
  "data": [
    { "label": "2012", "value": 1024, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 2048, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 4192, "color": "var(--mb-colour-yellow)" }
  ]
}
```

```charty
{
  "title":  "No labels or numbers",
  "config": {
    "type":    "pie",
    "color":   "var(--mb-colour-blue)",
    "labels":  false,
    "numbers": false
  },
  "data": [
    { "label": "2012", "value": 1024, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 2048, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 4192, "color": "var(--mb-colour-yellow)" }
  ]
}
```
