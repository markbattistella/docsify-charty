<figure class="css-chart" style="--widget-size: 20em;">
  <ul class="line-chart">
    <li style="--x: 40px; --y: 83.3333px;">
      <div class="data-point" data-value="25"></div>
      <div class="line-segment" style="--hypotenuse: 123.33333333333333; --angle:-71.07535558394876;"></div>
    </li>
    <li style="--x: 80px; --y: 200px;">
      <div class="data-point" data-value="60"></div>
      <div class="line-segment" style="--hypotenuse: 64.03124237432849; --angle:51.34019174590991;"></div>
    </li>
    <li style="--x: 120px; --y: 150px;">
      <div class="data-point" data-value="45"></div>
      <div class="line-segment" style="--hypotenuse: 43.333333333333336; --angle:-22.61986494804045;"></div>
    </li>
    <li style="--x: 160px; --y: 166.667px;">
      <div class="data-point" data-value="50"></div>
      <div class="line-segment" style="--hypotenuse: 52.068331172711055; --angle:39.805571092265225;"></div>
    </li>
    <li style="--x: 200px; --y: 133.333px;">
      <div class="data-point" data-value="40"></div>
      <div class="line-segment" style="--hypotenuse: 0; --angle:0;"></div>
    </li>    
  </ul>
</figure>






<style>
.css-chart {
  border-bottom: 1px solid;
  border-left: 1px solid;
  display: inline-block;
  height: var(--widget-size);
  margin: 5em 15em 1em 5em;
  padding: 0;
  position: relative;
  width: var(--widget-size);
}

.line-chart {
  list-style: none;
  margin: 0;
  padding: 0;
}

.data-point {
  background-color: black;
  border-radius: 50%;
  bottom: calc(var(--y) - 3px);
  height: 6px;
  left: calc(var(--x) - 3px);
  position: absolute;
  width: 6px;
  z-index: 1;
}

.line-segment {
  background-color: #ddd;
  bottom: var(--y);
  height: 1px;
  left: var(--x);
  position: absolute;
  transform: rotate(calc(var(--angle) * 1deg));
  transform-origin: left bottom;
  width: calc(var(--hypotenuse) * 1px);
}



</style>
