```charty
{
  "title":  "Labels and numbers",
  "config": {
    "type":    "rating",
    "labels":  true,
    "numbers": true,
	"groups":  4
  },
  "data": [
    { "label": "Features",  "value": 100, "color": "var(--mb-colour-green)"  },
    { "label": "Usability", "value": 150, "color": "var(--mb-colour-blue)"   },
    { "label": "Price",     "value": 30,  "color": "var(--mb-colour-green)"  },
    { "label": "Gameplay",  "value": 90,  "color": "var(--mb-colour-yellow)" }
  ]
}
```



<style>
aside.rating .rating-row {
	display: flex;

	font-size: 16px;
	font-weight: bold;
	color: #FFF;
	text-align: center;
	line-height: 3em;
	overflow: hidden;
}

aside.rating .rating-row:first-child {
	border-radius: 5px 5px 0 0;
}

aside.rating .rating-row:last-child {
	border-radius: 0 0 5px 5px;
}

aside.rating .rating-row > div {
	margin: 1px 1px 0 0;
	width: 100%;
}

aside.rating .rating-label {
	max-width: 8em;
	background: var(--mb-colour-blue);
}

aside.rating .rating-value {
	max-width: 4em;
	background: var(--mb-colour-gray);
}
aside.rating .rating-bar-container {
	width: 100%;
	background: var(--mb-colour-light);
}
aside.rating .rating-bar-color {
	width: 0%;
	background: var(--mb-colour-green);
}
</style>
