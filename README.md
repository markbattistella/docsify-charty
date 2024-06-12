<div align="center" class="gh">

# docsify.js charty

</div>

This plugin enhances your Docsify documentation by adding SVG charts to your website. It allows you to add in multiple types of charts, including pie, doughnut, sectional, radar, area, scatter, line, and bar types. By utilising this plugin, you can easily show your data in a beautiful interface.

## Installation

### Update `index.html` file

Assuming you have a working [docsify](https://docsify.js.org/) framework set up, it is easy to use the plugin.

1. Add the following script and stylesheet to your `index.html` via either CDN or downloading it and using it locally:

    ```html
    <!-- unpkg.com -->
    <script src="https://unpkg.com/@markbattistella/docsify-charty@latest/dist/docsify-charty.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@markbattistella/docsify-charty@latest/dist/docsify-charty.min.css">

    <!-- jsDelivr -->
    <script src="https://cdn.jsdelivr.net/npm/@markbattistella/docsify-charty@latest"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@markbattistella/docsify-charty@latest/dist/docsify-charty.min.css">

    <!-- locally -->
    <script src="docsify-charty.min.js"></script>
    <link rel="stylesheet" href="docsify-charty.min.css">
    ```

1. In docsify setup, configure the plugin:

    ```js
    <script>
    window.$docsify = {
      charty: {

        // Global theme for chart colours in HEX
        theme: '.',

        // Accepts "dark" or "light"
        mode: "light",

        // Boolean to enable or disable debug messages
        debug: false
      }
   };
   </script>
   ```

## Configuration

There are several options available for the docsify-charty plugin:

> Example: [index.html](https://github.com/markbattistella/docsify-charty/blob/b792e7701e740587f48598c7b61bc7f7ea39c366/docs/index.html#L36-L40)

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
\`\`\`
```

## Types of charts

### Circular

#### Pie chart

![docsify-charty: pie](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/pie.jpg)

#### Donut / Doughnut chart

![docsify-charty: donut](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/donut.jpg)

#### Section / Sectional chart

![docsify-charty: section](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/section.jpg)

#### Rings chart

![docsify-charty: rings](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/rings.jpg)

### Area

#### Radar chart

![docsify-charty: radar](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/radar.jpg)

#### Area chart

![docsify-charty: area](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/area.jpg)

### Plot

#### Scatter chart

![docsify-charty: scatter](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/scatter.jpg)

#### Bubble chart

![docsify-charty: bubble](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/bubble.jpg)

#### Line chart

![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/line.jpg)<br>
![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/line-stack.jpg)

### Bar / Column

### Bar / Bar-stack chart

![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/bar.jpg)<br>
![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/bar-stack.jpg)

### Column / Column-stack chart

![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/column.jpg)<br>
![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/column-stack.jpg)

### Rating

![docsify-charty: line](https://raw.githubusercontent.com/markbattistella/docsify-charty/main/docs/demo/rating.jpg)

## Contributing

1. Clone the repo: `git clone https://github.com/markbattistella/docsify-charty.git`

1. Create your feature branch: `git checkout -b my-feature`

1. Commit your changes: `git commit -am 'Add some feature'`

1. `Push` to the branch: `git push origin my-new-feature`

1. Submit the `pull` request
