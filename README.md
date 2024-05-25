<!-- markdownlint-disable -->
<div align="center" class="gh">

# docsify-charty

<small style="margin-bottom:2em;">by Mark Battistella</small>

[![](https://img.shields.io/badge/%20-@markbattistella-blue?logo=paypal&style=for-the-badge)](https://www.paypal.me/markbattistella/6AUD) [![](https://img.shields.io/badge/%20-buymeacoffee-black?logo=buy-me-a-coffee&style=for-the-badge)](https://www.buymeacoffee.com/markbattistella)

:sparkles: [![](https://img.shields.io/badge/demo-@markbattistella/docsify--charty-1E5749?style=for-the-badge)](https://markbattistella.github.io/docsify-charty-docs/) :sparkles:

</div>

---

## Installation

### Update `index.html` file

1. Add the following script and stylesheet to your `index.html` via either CDN or downloading it and using it locally:

    **unpkg.com**

    ```html
    <script src="//unpkg.com/@markbattistella/docsify-charty@latest/dist/docsify-charty.min.js"></script>
    <link rel="stylesheet" href="//unpkg.com/@markbattistella/docsify-charty@latest/dist/docsify-charty.min.css">
    ```

    **jsDelivr.com**

    ```html
    <script src="//cdn.jsdelivr.net/npm/@markbattistella/docsify-charty@latest"></script>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/@markbattistella/docsify-charty@latest/dist/docsify-charty.min.css">
    ```

    **locally**

    ```html
    <script src="docsify-charty.min.js"></script>
    <link rel="stylesheet" href="docsify-charty.min.css">
    ```

1. In docsify setup configure the plugin (see [configuration](#configuration) for setup). These are the global settings and affect all charts:

 ```js
 window.$docsify = {
   charty: {
     "theme": String,
     "mode":  String,
     "debug": Boolean
   }
 };
 ```

### npm install

Or if you're using `npm` to manage your dependencies:

```sh
npm i @markbattistella/docsify-charty
```

## Configuration

### Global settings

> Example: [index.html](https://github.com/markbattistella/docsify-charty-docs/blob/38573bff480009d5bbe7cdbbab12fe0474fa7407/index.html#L37-L40)

| Name    | Type      | Example   |  Description                              |
|---------|-----------|-----------|-------------------------------------------|
| `theme` | `String`  | "#EE5599" | Global theme for chart colours in HEX     |
| `mode`  | `String`  | "light"   | Accepts "dark" or "light"                 |
| `debug` | `Boolean` | false     | Console logs if charts aren't loading     |

### Per chart settings

| Name              | Accepts       | Description                              |
|-------------------|---------------|------------------------------------------|
| `title`           | `String`      | The title of the chart, displayed at the top. Leave blank if you want to hide it |
| `caption`         | `String`      | The sub-text of the chart, displayed under the title. Leave blank to hide it |
| `type`            | `String`      | The type of charty you want to display   |
| `options.theme`   | `String`      | Set an individual theme to this chart. It will override the global theme |
| `options.legend`  | `Boolean`     | Show the legend. Default `true`          |
| `options.labels`  | `Boolean`     | Show the chart labels. Default `true`    |
| `options.numbers` | `Boolean`     | Show the chart numbers. Default `true`   |
| `data.label`      | `String`      | Graphed data point label                 |
| `data.value`      | `Int / Array` | Graphed value that puts it on the render |
| `data.colour`     | `String`      | Override the global and theme with a specific colour |

### Markdown code

```js
```charty
{
  "title":   '',
  "caption": '',
  "type":    '',
  "options": {
    "theme":   '',
    "legend":  '',
    "labels":  '',
    "numbers": ''
  },
  "data": [
    {
      "label": '',
      "value": '',
      "colour": ''
    }
  ]
}
// close the code block
// can't show it here
```

## Types of charts

### Circular

#### pie

![docsify-charty: pie](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/pie.jpg)

#### donut / doughnut

![docsify-charty: donut](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/donut.jpg)

#### section / sectional

![docsify-charty: section](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/section.jpg)

#### rings

![docsify-charty: rings](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/rings.jpg)

### Area

#### radar

![docsify-charty: radar](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/radar.jpg)

#### area

![docsify-charty: area](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/area.jpg)

### Plot

#### scatter

![docsify-charty: scatter](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/scatter.jpg)

#### bubble

![docsify-charty: bubble](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/bubble.jpg)

#### line

![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/line.jpg)<br>
![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/line-stack.jpg)

### Bar / Column

### bar / bar-stack

![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/bar.jpg)<br>
![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/bar-stack.jpg)

### column / column-stack

![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/column.jpg)<br>
![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/column-stack.jpg)

### Rating

![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty-docs/main/demo/rating.jpg)

## Contributing

1. Clone the repo:

    `git clone https://github.com/markbattistella/docsify-charty.git`

1. Create your feature branch:

    `git checkout -b my-feature`

1. Commit your changes:

    `git commit -am 'Add some feature'`

1. `Push` to the branch:

    `git push origin my-new-feature`

1. Submit the `pull` request
