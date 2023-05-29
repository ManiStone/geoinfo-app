import './style.css';

import DragAndDrop from 'ol/interaction/DragAndDrop';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import {Draw, Modify, Snap} from 'ol/interaction.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {get} from 'ol/proj.js';
import {toLonLat} from 'ol/proj.js';
import {toStringHDMS} from 'ol/coordinate.js';

import Link from 'ol/interaction/Link';


/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
const popupOverlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  popupOverlay.setPosition(undefined);
  closer.blur();
  return false;
};


// Open Street Map
const raster = new TileLayer({
  source: new OSM(),
});


const source = new VectorSource();
const vector = new VectorLayer({
  source: source,
  style: {
    'fill-color': 'rgba(255, 255, 255, 0.2)',
    'stroke-color': '#ff0000',
    'stroke-width': 2,
    'circle-radius': 7,
    'circle-fill-color': '#ffcc33',
  },
});

// Limit multi-world panning to one world east and west of the real world.
// Geometry coordinates have to be within that range.
const extent = get('EPSG:3857').getExtent().slice();
extent[0] += extent[0];
extent[2] += extent[2];
const map = new Map({
  layers: [raster, vector],
  overlays: [popupOverlay],
  target: 'map-container',
  view: new View({
    center: [0, 0], // [-11000000, 4600000],
    zoom: 3,
    extent,
  }),
});

// Save position of map after reload
map.addInteraction(new Link());

// Add Drag and Drop of GeoJSON
map.addInteraction(
  new DragAndDrop({
      source: source,
      formatConstructors: [GeoJSON],
  })
);

// Add modify: drag objects by clicking them again
const modify = new Modify({source: source});
map.addInteraction(modify);


// Add draw interaction
let draw, snap; // global so we can remove them later
const typeSelect = document.getElementById('type');

function addInteractions() {
  draw = new Draw({
    source: source,
    type: typeSelect.value,
  });
  map.addInteraction(draw);
  snap = new Snap({source: source});
  map.addInteraction(snap);
}

/**
 * Handle change event.
 */
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  if (typeSelect.value !== 'OFF') {
    addInteractions();
  }
};

addInteractions();


// Clear GeoJSON
const clear = document.getElementById('clear');
clear.addEventListener('click', function () {
    source.clear();
});

// Save GeoJSON
const format = new GeoJSON({featureProjection: 'EPSG:3857'});
const download = document.getElementById('download');
source.on('change', function () {
  const features = source.getFeatures();
  const json = format.writeFeatures(features);
  download.href =
    'data:application/json;charset=utf-8,' + encodeURIComponent(json);
});


/**
 * Add a click handler to the map to render the popup.
 */
map.on('dblclick', function (evt) {
  const coordinate = evt.coordinate;

  const feature = source.getFeaturesAtCoordinate(coordinate)

  // const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
  //   return feature;
  // });

  if (map.hasFeatureAtPixel(evt.pixel) === true) {
    // console.log(feature)
    content.innerHTML = '<p>You clicked feature:</p><code>' + toStringHDMS(toLonLat(coordinate)) + '</code>'; 
    // var objeto = feature.getProperties(),propiedades;
    // for (propiedades in objeto)
    // {
    //   content.innerHTML += '<b>' + propiedades + '</b> : <i><b>'+ objeto[propiedades]+'</b></i><br />';
    // }
    // content.innerHTML += '<b>type:</b>: ' + feature[0].type + ' / ' + feature[0].getGeometry().type + '<br />';
    // content.innerHTML = '<p>You clicked feature:</p><code>' + feature.getProperties() + '</code>'; 
  } else {
    const hdms = toStringHDMS(toLonLat(coordinate));
    content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';  
  }
  popupOverlay.setPosition(coordinate);
});
