> :warning: **This repo / package is going to be updated to v2.0.0 soon(ish). There are some big changes** :warning:

<div align="center">

# docsify-charty

[![](https://img.shields.io/badge/%20-@markbattistella-blue?logo=paypal&style=for-the-badge)](https://www.paypal.me/markbattistella/6AUD)
[![](https://img.shields.io/badge/%20-buymeacoffee-black?logo=buy-me-a-coffee&style=for-the-badge)](https://www.buymeacoffee.com/markbattistella)
</div>

---

> I wanted to create something that was powerful but also not too overbearing.<br><br>There are tonnes of charing libraries out there, and some are **way** more powerful but I wanted to try building my own.<br><br>My main goal was to have a format that was reusable, and easy to switch between a pie chart to a rating block to a bar graph - all without changing the main data.<br><br>There's some work still to be done, but I think at the moment it is functional enough for small use.

## Installation

### Update `index.html` file

Assuming you have a working [docsify](https://docsify.js.org/) framework set up, it is easy to use the plugin.

1. Add the following script and stylesheet to your `index.html` via either CDN or downloading it and using it locally:

    ```html
    <!-- unpkg.com -->
    <script src="https://unpkg.com/@markbattistella/docsify-charty@latest"></script>
    <link rel="stylesheet" href="https://unpkg.com/@markbattistella/docsify-charty@1.0.4/dist/docsify-charty.min.css">

    <!-- jsDelivr -->
    <script src="https://cdn.jsdelivr.net/npm/@markbattistella/docsify-charty@latest"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@markbattistella/docsify-charty@latest/dist/docsify-charty.min.css">

    <!-- locally -->
    <script src="docsify-charty.min.js"></script>
    <link rel="stylesheet" href="docsify-charty.min.css">
    ```

1. In docsify setup configure the plugin (see [configuration](#configuration) for setup):

    ```js
    <script>
    window.$docsify = {
      charty: {
        "theme": String,
        "mode":  String
      },
    };
    </script>
    ```

### npm install

Or if you're using `npm` to manage your dependencies:

```sh
npm i @markbattistella/docsify-charty
```

## Configuration

There is only two (optional) main configurations:

?> **Note:** the `mode` is currently not active

| Name    | Setting                                                   |
|---------|-----------------------------------------------------------|
| `theme` | Set a global theme for the item colours - needs to be HEX |
| `mode`  | Dark or light theme - to compliment your design           |

### Markdown code

```json
{
  "title":  String,
  "config": {
    "type":    String,
    "labels":  Bool,
    "numbers": Bool,
    "groups":  Int,
    "color":   String
  },
  "data": [
    { "label": String, "value": Int, "color": String }
  ]
}
```

| Option            | Required | Meaning                                      |
|-------------------|----------|----------------------------------------------|
| `title`           |          | This is the title of the chart / graph       |
| `$config.type`    | Yes      | Type of charty graph: `bar / column / doughnut / donut / line / pie / plot / rating / section /sectional`                    |
| `$config.labels`  |          | Show the data point labels or not            |
| `$config.numbers` |          | Show the data point values or not            |
| `$config.groups`  |          | If using `column` or `bar` you can have the graph space out the data every `n`. In a `rating` it is the max that the ratings are rated out of |
| `$config.color`   |          | The global theme for all charty items - if no colours are manually set it will use this to make one                         |
| `$data.label`     |          | Graph data point label                       |
| `$data.value`     | Yes      | Graph value that puts it on the render       |
| `$data.color`     |          | If you want to override the theme colour you can manually do it per data point |

Not every option is available on every charty type, however the easiest way would be to look at the `docs/charty/` files :smile:

## Types of charts

### Pie Chart

#### With legend

![](/docs/demo/01.jpg)

#### Without Legend

![](/docs/demo/02.jpg)

### Donut / Doughnut Chart

![](/docs/demo/03.jpg)

### Sectional chart

![](/docs/demo/04.jpg)

### Column chart

![](/docs/demo/05.jpg)

### Line graph

### Normal state

![](/docs/demo/06.jpg)

### Hover for details

![](/docs/demo/07.jpg)

### Plot graph

![](/docs/demo/08.jpg)

### Review / rating chart

![](/docs/demo/09.jpg)

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
