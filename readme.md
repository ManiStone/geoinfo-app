# OpenLayers + Vite

## References

- https://openlayers.org/  
- https://openlayers.org/doc/quickstart.html 
- https://openlayers.org/workshop/en/ 
- https://openlayers.org/en/latest/examples/ 
- Draw and modify points, lines, polygons and circles: 
  https://openlayers.org/en/latest/examples/draw-and-modify-features.html 
- Popup: https://openlayers.org/en/latest/examples/popup.html 


## Quick start

Setup a new project and start the development server:
(available at http://localhost:5173):

    npm create ol-app geoinfo-app
    cd geoinfo-app
    npm start

A launch.json is provided to debug the application in Visual Studio Code. 

To generate a build ready for production:

    npm run build

Then deploy the contents of the `dist` directory to your server.  You can also run `npm run serve` to serve the results of the `dist` directory for preview.


## User documentation

- You can draw points and other features on the map. 
- With Button "Download" it is possible to save the features as JSON.
- You can drag & drop a JSON file on the map to load the content (see data/holidays.json).
- With a double click on a feature a popup is shown. If the name propertys is set in the JSON the value is shown.
- With "Draw type" = "OFF" a double click on the map shows a popup with the coordinates. 
