

// Create Map
mapboxgl.accessToken = 
'pk.eyJ1IjoieXVlcnVjIiwiYSI6ImNrdDN3ZWpheDExdWoydm54d2tyaWw3b2IifQ.QFuYv_lBJTg9VdCB9pq66Q';

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [144.961, -37.8],
    zoom: 12.48
});


// Create layers
let layers = [
    {
        "icon": "http://lish.cool:8002/data/mapbox/mapbox-%E5%88%86%E7%B1%BB/attractions.png",
        "name": "Attractions",
        "color": "rgb(115, 146, 186)",
        "transparentColor": "rgb(115, 146, 186, .6)"
    },
    {
        "icon": "http://lish.cool:8002/data/mapbox/mapbox-%E5%88%86%E7%B1%BB/art museum.png",
        "name": "Art Museum",
        "color": "rgb(244, 166, 77)",
        "transparentColor": "rgb(244, 166, 77, .6)"
    },
    {
        "icon": "http://lish.cool:8002/data/mapbox/mapbox-%E5%88%86%E7%B1%BB/train-solid.png",
        "name": "Railway",
        "color": "rgb(231, 121, 121)",
        "transparentColor": "rgb(231, 121, 121, .6)"
    },
    {
        "icon": "http://lish.cool:8002/data/mapbox/mapbox-%E5%88%86%E7%B1%BB/recreation facility.png",
        "name": "Recreation Facility",
        "color": "rgb(145, 197, 193)",
        "transparentColor": "rgb(145, 197, 193, .6)"
    }
];

// ++ popup global variable
let popup = null; 


let buttons = document.querySelector('#buttons');

//Loading map
map.on('load', e => {

    // add layer and button of land-use layers 
    for (let layer of layers) {
                                // ++ popup start
        map.on('click', layer.name, (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const pros = e.features[0].properties;
            console.log(e.features[0].properties);
            let result = '';
            // Object.getOwnPropertyNames(pros).forEach(function (key) {
            //     result += `<div class='mypopup'><label>${key}</label> : <span>${pros[key]}</span></div>`
            // });
            result = `<div class='mypopup'><span style="color:${layer.color}; font-weight:700">${pros.Feature_Na}</span>
                    </br><span> ${pros.Theme}</span>
                    </br><span> ${pros.Sub_Theme}</span></div>`;
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            
            popup && popup.remove();
            popup = new mapboxgl.Popup({className: 'my-popup', closeOnClick: false, closeButton: false, maxWidth: 400})
                .setLngLat(coordinates)
                .setHTML(result)
                .addTo(map);
            
                

        });
        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', layer.name, () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', layer.name, () => {
            map.getCanvas().style.cursor = '';
        });

        // make legend button
        let link = document.createElement('a');

        link.href = '#';

        link.style.backgroundColor = layer.color;
        link.textContent = layer.name;
        link.dataset.layerName = layer.name;
        link.dataset.activity = 'none';


       
        buttons.appendChild(link);


        link.onclick = e => {
            let clickedLayer = e.target.dataset.layerName;
            e.preventDefault();
            e.stopPropagation();
          
            let visibility = map.getLayoutProperty(clickedLayer, 'visibility');
          
            if (visibility !== 'none') {
              map.setLayoutProperty(clickedLayer, 'visibility', 'none');
              link.style.backgroundColor = layer.transparentColor;
              e.target.classList.remove('active');
            } else {
              e.target.classList.add('active');
              map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
              link.style.backgroundColor = layer.color;
            }
          };

       
    }

});


map.on('style.load', function() {
    for (let layer of layers) {
        if (layer.name === 'Art Museum' && document.querySelector('input[name="rtoggle"]:checked').value === 'dark') {
          continue;
      }
    map.loadImage(
        layer.icon,
        (error, image) => {
            if (error) throw error;
            map.addImage('custom-marker-' + layer.name, image);
        map.addLayer({
            "id": layer.name,
            "type": "symbol",
            "source": {
                "type": "vector",
                "url": "mapbox://yueruc.6c7u7jru"
            }, 
            "source-layer": "POI1-dsy5ld",
            'layout': {
                'icon-image': 'custom-marker-' + layer.name,
                'icon-size': 0.025,
                // get the title name from the source's "title" property
                // 'text-field': ['get', 'title'],
                'text-font': [
                    'Open Sans Semibold',
                    'Arial Unicode MS Bold'
                ],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            },
        "filter": ["==", "Classification", layer.name]
        });
        })
    }
  });

  var layerList = document.getElementById('mapformat');
  var inputs = layerList.getElementsByTagName('input');

  function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);
  }

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
  }
  


let mapboxDirections =  new MapboxDirections({
    accessToken: mapboxgl.accessToken
});

var switchStatus = false;
$("#togBtn").on('change', function() {
    if ($(this).is(':checked')) {
        switchStatus = $(this).is(':checked');
        map.addControl(mapboxDirections,'top-right');
    }
    else {
       switchStatus = $(this).is(':checked');
       map.removeControl(mapboxDirections);
    }
});



for (let layer of layers){
    map.on('click', layer.name, function (e) {
        map.flyTo({
              center: e.features[0].geometry.coordinates
        });
    });
}


   





  

  




