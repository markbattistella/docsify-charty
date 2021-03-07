```charty
{
  "title":  "Labels and numbers",
  "config": {
    "type":    "bar",
    "labels":  true,
    "numbers": true,
	"groups":  4
  },
  "data": [
    { "label": "2010", "value": 100, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 150, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 30, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 90, "color": "var(--mb-colour-yellow)" },

    { "label": "2010", "value": 10, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 50, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 30, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 90, "color": "var(--mb-colour-yellow)" },

    { "label": "2010", "value": 10, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 50, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 30, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 90, "color": "var(--mb-colour-yellow)" },

    { "label": "2010", "value": 10, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 50, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 30, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 90, "color": "var(--mb-colour-yellow)" }
  ]
}
```

```charty
{
  "title":  "Labels, no numbers",
  "config": {
    "type":    "bar",
    "labels":  true,
    "numbers": false,
	"groups":  3
  },
  "data": [
    { "label": "2012", "value": 10, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 28, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 89, "color": "var(--mb-colour-yellow)" }
  ]
}
```

```charty
{
  "title":  "No labels or numbers",
  "config": {
    "type":    "bar",
    "labels":  false,
    "numbers": false
  },
  "data": [
    { "label": "2012", "value": 10, "color": "var(--mb-colour-blue)"   },
    { "label": "2010", "value": 28, "color": "var(--mb-colour-green)"  },
    { "label": "2012", "value": 89, "color": "var(--mb-colour-yellow)" }
  ]
}
```
