AFRAME.registerComponent('atoms', {

    init: async function () {
      // Do something when component first attached.
      var compounds = await this.getCompounds();
      var barcodes = Object.keys(compounds); // [0,1]
      barcodes.map(barcode => {
        var element = compounds[barcode];

        
        //Llamar a la función para crear los atomos con los datos del JSON
        this.createAtoms(element);
      })

    },


    getCompounds: function () {
        //Obtener los detalles de la composición del archivo JSON
        return fetch('json/compounds.json')
        .then(res => res.json())
        .then(data => data);
    },
    getElementColors: function () {
        //Obtener el color del elemento del archivo JSON
        return fetch('json/elementColors.json')
        .then(res => res.json())
        .then(data => data);
    },
    createAtoms: async function (element) {
        console.log("hola")
        //Datos del elemento
        var elementName = element.element_name;
        var barcodeValue = element.barcode_value;
        var numOfElectron = element.number_of_electron;

        //Obtener el color del elemento
        var colors = await this.getElementColors();

        //Escena
        var scene = document.querySelector('a-scene');

        // Añadir entidad de marcador para el marcador de código de barras
        var marker = document.createElement('a-marker');

        marker.setAttribute('id', `marker-${barcodeValue}`); // Template string `Esto-EsTexto-${soyvariable}-encadeno-con-mas-${soyOtraVariable}-ademas-${5+3}` 
        marker.setAttribute('type', 'barcode');
        marker.setAttribute('element_name', elementName);
        marker.setAttribute('value', barcodeValue);

        scene.appendChild(marker);

        //Crear tarjeta de atomo

        //Crear núcleo

        //Crear órbita para la revolución del electrón

        //Crear entidad de animación de la revolución de los electrones

    }
});
