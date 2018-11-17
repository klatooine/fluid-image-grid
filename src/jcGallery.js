/*!
 * jcGallery v0.0.1
 * by Javier Collazos 2018
 *
 * More info:
 * https://github.com/klatooine/jc-gallery
 *
 * Released under the MIT license
 * License: http://www.opensource.org/licenses/mit-license.php
 *
 */

const defaultAspectRatio = 1;
const defaultGap = 5;
const defaultGridType = "fixed";
const defaultHoverEffect = "none";
const defaultMinElementWidth = 100;
const defaultMaxElementWidth = 200;
const defaultMaxElementRowSpan = 2;
const defaultMaxElementColumnSpan = 2;

let jcGallery = (function jcGallery(inputOptions) {
  let jcGalleries = document.getElementsByClassName("jc-gallery");

  for (let gallery of jcGalleries) {
    let options = loadOptions(gallery, inputOptions);
    let numberOfColumns = calculateColumns(gallery, options.minElementWidth, options.maxElementWidth);

    if (numberOfColumns <= 0) {
      return;
    }

    displayGallery(gallery, numberOfColumns, options);

    registerResizeEventListener(gallery, numberOfColumns, options);
  }

  function loadOptions(gallery, inputOptions) {
    let options = {
      aspectRatio: gallery.dataset.aspectRatio ? gallery.dataset.aspectRatio : null,
      gap: gallery.dataset.gap ? gallery.dataset.gap : null,
      gridType: gallery.dataset.gridType ? gallery.dataset.gridType : null,
      hoverEffect: gallery.dataset.hoverEffect ? gallery.dataset.hoverEffect : null,
      minElementWidth: gallery.dataset.minElementWidth ? gallery.dataset.minElementWidth : null,
      maxElementWidth: gallery.dataset.maxElementWidth ? gallery.dataset.maxElementWidth : null,
      maxElementRowSpan: gallery.dataset.maxElementRowSpan ? gallery.dataset.maxElementRowSpan : null,
      maxElementColumnSpan: gallery.dataset.maxElementColumnSpan ? gallery.dataset.maxElementColumnSpan : null
    };

    if (!options.aspectRatio) {
      options.aspectRatio = inputOptions && inputOptions.aspectRatio ? inputOptions.aspectRatio : defaultAspectRatio;
    }

    if (!options.gap) {
      options.gap = inputOptions && inputOptions.gap ? inputOptions.gap : defaultGap;
    }

    if (!options.gridType) {
      options.gridType = inputOptions && inputOptions.gridType ? inputOptions.gridType :  defaultGridType;
    }

    if (!options.hoverEffect) {
      options.hoverEffect = inputOptions && inputOptions.hoverEffect ? inputOptions.hoverEffect : defaultHoverEffect;
    }

    if (!options.minElementWidth) {
      options.minElementWidth = inputOptions && inputOptions.minElementWidth ? inputOptions.minElementWidth :  defaultMinElementWidth;
    }

    if (!options.maxElementWidth) {
      options.maxElementWidth = inputOptions && inputOptions.maxElementWidth ? inputOptions.maxElementWidth :  defaultMaxElementWidth;
    }

    if (!options.maxElementRowSpan) {
      options.maxElementRowSpan = inputOptions && inputOptions.maxElementRowSpan ? inputOptions.maxElementRowSpan :  defaultMaxElementRowSpan;
    }

    if (!options.maxElementColumnSpan) {
      options.maxElementColumnSpan = inputOptions && inputOptions.maxElementColumnSpan ? inputOptions.maxElementColumnSpan :  defaultMaxElementColumnSpan;
    }

    return options;
  }

  function calculateColumns(gallery, minElementWidth, maxElementWidth) {
    let galleryWidth = gallery.offsetWidth;
    let numberOfColumns = Math.floor(galleryWidth / maxElementWidth);

    if (maxElementWidth - minElementWidth < 50) {
      maxElementWidth = minElementWidth + 50;
    }

    if (numberOfColumns > (galleryWidth / minElementWidth)) {
      numberOfColumns = Math.floor(galleryWidth / minElementWidth);
    }

    return numberOfColumns;
  }

  function calculateElementHeight(gallery, numberOfColumns, aspectRatio, gap) {
    let galleryWidth = gallery.offsetWidth;
    let elementHeight = aspectRatio * (galleryWidth - (numberOfColumns + 2) * gap) / numberOfColumns;

    return elementHeight;
  }

  function displayGallery(gallery, numberOfColumns, options) {
    let elements = gallery.children;

    if (elements.length < 1) {
      return;
    }

    let elementHeight = calculateElementHeight(gallery, numberOfColumns, options.aspectRatio, options.gap);
    initializeGrid(gallery, numberOfColumns, elementHeight, options.gap);
    displayElements(elements, numberOfColumns, options.maxElementRowSpan, options.maxElementColumnSpan, options.gridType, options.hoverEffect);
  }

  function initializeGrid(gallery, numberOfColumns, elementHeight, gap) {
    let gridTemplateColumns = "";

    for(let i = 0; i < numberOfColumns; i++) {
      gridTemplateColumns += "auto ";
    }

    gallery.style.gridTemplateColumns = gridTemplateColumns;
    gallery.style.gridAutoRows = elementHeight + "px";
    gallery.style.gap = gap + "px";
  }

  function displayElements(elements, numberOfColumns, maxElementRowSpan, maxElementColumnSpan, gridType, hoverEffect) {
    let rowIndexes = Array(numberOfColumns).fill(1);
    let index = 0;

    for(let element of elements) {
      displayElement(element, rowIndexes, numberOfColumns, maxElementRowSpan, maxElementColumnSpan, gridType);

      if (isClickable(element)) {
        makeElementClickable(element, elements);
      }

      index++;
    }
  }

  function displayElement(element, rowIndexes, numberOfColumns, maxElementRowSpan, maxElementColumnSpan, gridType) {
    let columnSpan = 1;
    let rowSpan = 1;
    let currentColumnIndex = rowIndexes.indexOf(Math.min.apply(null, rowIndexes)) + 1;

    if (gridType === "fixed") {
      maxElementRowSpan = 1;
      maxElementColumnSpan = 1;
    } else if (gridType === "fixedHeight") {
      maxElementRowSpan = 1;
    } else if (gridType === "fixedWidth") {
      maxElementColumnSpan = 1;
    }

    rowSpan = Math.floor(Math.random() * maxElementRowSpan) + 1;

    if (numberOfColumns - currentColumnIndex >= maxElementColumnSpan - 1) {
      columnSpan = Math.floor(Math.random() * maxElementColumnSpan) + 1;

      for (let i = 0; i < columnSpan; i++) {
        if (rowIndexes[currentColumnIndex + i - 1] != rowIndexes[currentColumnIndex - 1]) {
          columnSpan = i;

          break;
        }
      }
    }

    element.style.gridRow = rowIndexes[currentColumnIndex - 1] + " / span " + rowSpan;
    element.style.gridColumn = currentColumnIndex + " / span " + columnSpan;

    for (let i = 0; i < columnSpan; i++) {
      rowIndexes[currentColumnIndex - 1 + i] += rowSpan;
    }

    if (isImage(element)) {
      let media = element.children.item(0);
      let thumbImageSrc = media.src;
      element.style.backgroundImage = "url('" + thumbImageSrc + "')";
    } else if (isVideo(element)) {
      let media = element.children.item(0);
      let playButton = displayPlayButton(element);

      registerOnVideoMouseOverListener(element, playButton, media);
      registerOnVideoMouseOutListener(element, playButton, media);
    }
  }

  function displayPlayButton(element) {
    let playButton = document.createElement('div');
    let playButtonIcon = document.createElement('span');

    playButtonIcon.classList.add("jc-gallery-play-button");

    playButton.classList.add("jc-gallery-play-button-box");
    playButton.classList.add("jc-gallery-visible");

    playButton.appendChild(playButtonIcon);

    element.appendChild(playButton);

    return playButton;
  }

  function makeElementClickable(element, elements) {
    element.classList.add('jc-gallery-clickable');

    registerOnElementClickListener(element, elements);
  }

  function openElement(element, elements) {
    let mediaViewer = document.getElementById("jc-gallery-media-viewer");

    if (!mediaViewer) {
      mediaViewer = displayMediaViewer(element);
    }

    displayMedia(element, elements, mediaViewer);
    displayNavigationButtons(element, elements, mediaViewer);
  }

  function displayMediaViewer(element) {
    let mediaViewer = document.createElement('div');
    let loader = document.createElement('div');

    mediaViewer.id = "jc-gallery-media-viewer";
    mediaViewer.classList.add("jc-gallery-background");
    loader.classList.add("jc-gallery-loading");

    element.parentElement.appendChild(mediaViewer);
    mediaViewer.appendChild(loader);

    displayCloseButton(mediaViewer);

    registerOnCloseEventListeners(element, mediaViewer);

    return mediaViewer;
  }

  function displayMedia(element, elements, mediaViewer) {
    let newMedia = null;
    let mediaContainer = document.createElement('div');

    mediaContainer.classList.add("jc-gallery-media-container");

    let currentMedia = document.getElementById("jc-gallery-media");

    if (currentMedia) {
      mediaViewer.removeChild(currentMedia);
    }

    if (isImage(element)) {
      newMedia = new Image();
    } else if (isVideo(element)) {
      newMedia = document.createElement("video");
      newMedia.controls = "controls";
      newMedia.autoplay = "autoplay";
    }

    newMedia.src = element.dataset.src;

    mediaContainer.appendChild(newMedia);
    mediaContainer.id = "jc-gallery-media";

    mediaViewer.appendChild(mediaContainer);
  }

  function displayNavigationButtons(element, elements, mediaViewer) {
    if (elements.length > 1) {
      displayNextButton(element, elements, mediaViewer);
      displayPreviousButton(element, elements, mediaViewer);
    }
  }

  function displayPreviousButton(element, elements, mediaViewer) {
    let previousButton = document.createElement('div');

    previousButton.classList.add("jc-gallery-button");
    previousButton.classList.add("jc-gallery-previous-button");
    previousButton.classList.add("jc-gallery-navigation-button");
    previousButton.textContent += "<";

    registerOnPreviousClickListener(previousButton, element, elements);

    mediaViewer.appendChild(previousButton);
  }

  function displayNextButton(element, elements, mediaViewer) {
    let nextButton = document.createElement('div');
    nextButton.classList.add("jc-gallery-button");
    nextButton.classList.add("jc-gallery-next-button");
    nextButton.classList.add("jc-gallery-navigation-button");
    nextButton.textContent += ">";

    registerOnNextClickListener(nextButton, element, elements);

    mediaViewer.appendChild(nextButton);
  }

  function displayCloseButton(mediaViewer) {
    let closeButton = document.createElement('div');

    closeButton.classList.add("jc-gallery-button");
    closeButton.classList.add("jc-gallery-close-button");
    closeButton.textContent += "x";

    mediaViewer.appendChild(closeButton);
  }

  function closeMediaViewer(element, mediaViewer) {
    element.parentElement.removeChild(mediaViewer);
  }

  function isImage(element) {
    let media = element.children.item(0);

    return media instanceof HTMLImageElement;
  }

  function isVideo(element) {
    let media = element.children.item(0);

    return media instanceof HTMLVideoElement;
  }

  function isClickable(element) {
    if (isVideo(element)) {
      return true;
    } else if (isImage(element)) {
      let imageSrc = element.dataset.src ? element.dataset.src : null;

      if (imageSrc) {
        return true;
      }
    }

    return false;
  }

  function registerResizeEventListener(gallery, numberOfColumns, options) {
    window.addEventListener("resize", function(event) {
      let previousNumberOfColumns = numberOfColumns;

      numberOfColumns = calculateColumns(gallery, options.minElementWidth, options.maxElementWidth);

      if (previousNumberOfColumns != numberOfColumns && numberOfColumns > 0) {
        displayGallery(gallery, numberOfColumns, options);
      }
    });
  }

  function registerOnElementClickListener(element, elements) {
    element.addEventListener('click', function(event) {
      openElement(element, elements);
    });
  }

  function registerOnPreviousClickListener(button, element, elements) {
    button.addEventListener('click', function(event) {
      let currentIndex = Array.from(elements).indexOf(element);
      let previousIndex = 0;

      if (currentIndex == 0) {
        previousIndex = elements.length - 2;
      } else {
        previousIndex = currentIndex - 1;
      }

      let previousElement = elements.item(previousIndex);

      openElement(previousElement, elements);
    });
  }

  function registerOnNextClickListener(button, element, elements) {
    button.addEventListener('click', function(event) {
      let currentIndex = Array.from(elements).indexOf(element);
      let previousIndex = 0;

      if (currentIndex == elements.length - 2) {
        previousIndex = 0;
      } else {
        previousIndex = currentIndex + 1;
      }

      let previousElement = elements.item(previousIndex);

      openElement(previousElement, elements);
    });
  }

  function registerOnVideoMouseOverListener(element, playButton, media) {
    element.addEventListener('mouseover', function(event) {
      playButton.classList.add("jc-gallery-hidden");

      media.play();
    });
  }

  function registerOnVideoMouseOutListener(element, playButton, media) {
    element.addEventListener('mouseout', function(event) {
      playButton.classList.remove("jc-gallery-hidden");

      media.pause();
    });
  }

  function registerOnCloseEventListeners(element, background) {
    background.addEventListener('click', function(event) {
      if (event.target.tagName != 'IMG' && event.target.tagName != 'VIDEO' && !event.target.classList.contains('jc-gallery-navigation-button')) {
        closeMediaViewer(element, background);
      }
    });

    document.onkeydown = function(evt) {
      evt = evt || window.event;
      if (evt.keyCode == 27) {
        closeMediaViewer(element, background);
      }
    };
  }
});
