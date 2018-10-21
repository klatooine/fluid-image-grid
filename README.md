# jcGallery

## What for
jcGallery is a responsive, HTML5, javascript, CSS3, Grid, media galleries generator.
It supports images as well as HTML5 videos. 
Easy to use, you can choose between 4 types of galleries.

## Using it

### Include it
Just include the js and css files where you want to create the gallery.

Then, add a jcGallery.

```html
<div class="jc-gallery">
</div>
```

### Add the media
Add as many images/videos inside your gallery as you want

```html
<div class="jc-gallery">
  <div class="jc-gallery-element" data-src="img/6_tn.jpg">
    <img src="img/6_tn.jpg" alt="Text for this image">
  </div>

  <div class="jc-gallery-element" data-src="img/7.jpg">
    <img src="img/7_tn.jpg" alt="Text for this image">
  </div>
</div>
```

### Initialize
And then just call the jcGallery() function after loading all your DOM.
```html
  <script type="text/javascript">
    jcGallery();
  </script>
```

## Configuring

### Options
You can configure the next options:

| Option        | Description           | Type | Available | Default |
| ------------- |:-------------:| -----:|-|----|
| aspectRatio | The size relation between width and height. | Float | | 1 |
| gap | The size in pixels between elements. | Integer |  | 5 |
| gridType | The type of grid to generate. | String | fixed, fixedHeight, fixedWidth, random | "fixed" |
| hoverEffect | The effect to apply over the elements on mousein. Only zoom available at them moment. | String | none, zoom | "none" |
| minElementWidth | The min width of an element to generate the responsive grid. | Integer |  | 100 |
| maxElementWidth | The max width of an element to generate the responsive grid. | Integer |  | 200 |
| maxElementRowSpan | The max number of rows to span an element if the gridType is fixedWidth or random. | Integer |  | 2 |
| maxElementColumnSpan | The max number of columns to span an element if the gridType is fixedHeight or random. | Integer |  | 2 |

### Overrinding defaults
To override the defaults for all the galleries avialable just pass an options object on initializalization.

```html
  <script type="text/javascript">
    options = {
      gap: 10,
      aspectRatio: 0.6,
      minElementWidth: 150,
      maxElementWidth: 300
    }

    jcGallery(options);
  </script>
```

### Distinct options multiple galleries
You can configure the gallery options for each gallery like this:

```html
<div class="jc-gallery" data-min-element-width="200" data-max-element-width="200" data-gap="5" data-aspect-ratio="0.7" data-grid-type="fixedHeight">
  <div class="jc-gallery-element" data-src="img/6_tn.jpg">
    <img src="img/6_tn.jpg" alt="Text for this image">
  </div>

  <div class="jc-gallery-element" data-src="img/7.jpg">
    <img src="img/7_tn.jpg" alt="Text for this image">
  </div>
</div>
```
