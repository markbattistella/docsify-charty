```charty
{
  "title":  "Labels and numbers",
  "config": {
    "type":    "column",
    "labels":  true,
    "numbers": true,
    "groups":  4
  },
  "data": [
    { "label": "2010", "value": 100 },
    { "label": "2011", "value": 150 },
    { "label": "2012", "value": 30  },
    { "label": "2013", "value": 90  },

    { "label": "2010", "value": 10  },
    { "label": "2011", "value": 50  },
    { "label": "2012", "value": 30  },
    { "label": "2013", "value": 90  }
  ]
}
```

```charty
{
  "title":  "Labels, no numbers",
  "config": {
    "type":    "column",
    "labels":  true,
    "numbers": false,
    "groups":  3
  },
  "data": [
    { "label": "2010", "value": 10, "color": "var(--mb-colour-blue)"   },
    { "label": "2011", "value": 28, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 89, "color": "var(--mb-colour-yellow)" }
  ]
}
```

```charty
{
  "title":  "No labels or numbers",
  "config": {
    "type":    "column",
    "labels":  false,
    "numbers": false
  },
  "data": [
    { "label": "2010", "value": 10, "color": "var(--mb-colour-blue)"   },
    { "label": "2011", "value": 28, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 89, "color": "var(--mb-colour-yellow)" }
  ]
}
```
