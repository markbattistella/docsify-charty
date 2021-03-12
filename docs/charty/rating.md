```charty
{
  "title":  "Labels and numbers",
  "config": {
    "type":    "rating",
    "labels":  true,
    "numbers": true,
    "groups":  5
  },
  "data": [
    { "label": "Features",  "value": 1 },
    { "label": "Usability", "value": 2 },
    { "label": "Price",     "value": 3 },
    { "label": "Gameplay",  "value": 6 }
  ]
}
```

```charty
{
  "title":  "Labels, no numbers",
  "config": {
    "type":    "rating",
    "labels":  true,
    "numbers": false,
    "groups":  5
  },
  "data": [
    { "label": "Features",  "value": 1, "color": "var(--mb-colour-green)"  },
    { "label": "Usability", "value": 2, "color": "var(--mb-colour-blue)"   },
    { "label": "Price",     "value": 3, "color": "var(--mb-colour-green)"  },
    { "label": "Gameplay",  "value": 6, "color": "var(--mb-colour-yellow)" }
  ]
}
```

```charty
{
  "title":  "Numbers, no labels",
  "config": {
    "type":    "rating",
    "labels":  false,
    "numbers": true,
    "groups":  5
  },
  "data": [
    { "label": "Features",  "value": 1, "color": "var(--mb-colour-green)"  },
    { "label": "Usability", "value": 2, "color": "var(--mb-colour-blue)"   },
    { "label": "Price",     "value": 3, "color": "var(--mb-colour-green)"  },
    { "label": "Gameplay",  "value": 6, "color": "var(--mb-colour-yellow)" }
  ]
}
```

```charty
{
  "title":  "No labels or numbers",
  "config": {
    "type":    "rating",
    "labels":  false,
    "numbers": false,
    "groups":  5
  },
  "data": [
    { "label": "Features",  "value": 1, "color": "var(--mb-colour-green)"  },
    { "label": "Usability", "value": 2, "color": "var(--mb-colour-blue)"   },
    { "label": "Price",     "value": 3, "color": "var(--mb-colour-green)"  },
    { "label": "Gameplay",  "value": 6, "color": "var(--mb-colour-yellow)" }
  ]
}
```
