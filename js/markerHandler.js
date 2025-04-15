var A = ["H", "Li", "Na", "K"];
var B = ["F", "Cl", "Br", "I"];

var C = ["O", "S", "Se"];

var elementsArray = [];


AFRAME.registerComponent('markerhandler', {

    init: async function () {
      var compounds = await this.getCompounds();

      // Administrar los eventos de los marcadores.
      this.el.addEventListener('markerFound', () => {
        var elementName = this.el.getAttribute("element_name");
        var barcodeValue = this.el.getAttribute("value");

        elementsArray.push({
            element_name: elementName,
            barcode_value: barcodeValue
        });

        // cambiar la visibilidad del compuesto
        compounds[barcodeValue]["compounds"].map(item => {
            var compound = document.querySelector(`#${item.compound_name}-${barcodeValue}`);
            compound.setAttribute("visible", false);
        });

        //cambiar la visibilidad del atomo
        var atom = document.querySelector(`#${elementName}-${barcodeValue}`);
        atom.setAttribute("visible", true);
      });

      this.el.addEventListener('markerLost', () => {
        var elementName = this.el.getAttribute("element_name");
        var index = elementsArray.findIndex(x => x.element_name === elementName);
        if (index > -1) {
            elementsArray.splice(index, 1);
        }
      });
    },

    tick: function () {
      if (elementsArray.length > 1) {
        var messageText = document.querySelector("#message-text");

        var length = elementsArray.length;
        var distance = null;

        var compound = this.getCompound();

        if(length === 2){
            var marker1 = document.querySelector(`#marker-${elementsArray[0].barcode_value}`);
            var marker2 = document.querySelector(`#marker-${elementsArray[1].barcode_value}`);

            distance = this.getDistance(marker1, marker2);

            if (distance < 1.25) {
                if(compound !== undefined){
                    this.showCompound(compound);
                } else {
                    messageText.setAttribute("visible", true);
                }
            } else {
                messageText.setAttribute("visible", false);
            }
        } else if(length === 3){

            var marker1 = document.querySelector(`#marker-${elementsArray[0].barcode_value}`);
            var marker2 = document.querySelector(`#marker-${elementsArray[1].barcode_value}`);
            var marker3 = document.querySelector(`#marker-${elementsArray[2].barcode_value}`);

            distance1 = this.getDistance(marker1, marker2);
            distance2 = this.getDistance(marker2, marker3);

            if (distance1 < 1.25 && distance2 < 1.25) {
                if(compound !== undefined){
                    this.showCompound(compound);
                } else {
                    messageText.setAttribute("visible", true);
                }
            } else {
                messageText.setAttribute("visible", false);
            }
        }
      }
    },

    getDistance: function (elA, elB) {
        return elA.object3D.position.distanceTo(elB.object3D.position);
    },

    countOccurrences: function (arr, val) {
        return arr.reduce((a, v) => (v.element_name === val ? a + 1 : a), 0);
      },

    getCompound: function () {
        for (var el of elementsArray) {
            if(A.includes(el.element_name)) {
                var compound = el.element_name;
                for (var i of elementsArray) {
                    if(B.includes(i.element_name)) {
                        compound = compound + i.element_name;
                        return {name: compound, value: el.barcode_value};
                    }

                    if (C.includes(i.element_name)) {
                        var count = this.countOccurrences(elementsArray, el.element_name);
                        if (count > 1) {
                            compound += count + i.element_name;
                            return {name: compound, value: i.barcode_value};
                        }
                    }
                }
            }

        } // End for loop
    },

    getCompounds: async function () {
      //Obtener los detalles de la composición del archivo JSON
      const res = await fetch("js/compoundList.json");
      const data = await res.json();
      return data;
    },

    // Función para mostrar el compuesto
    showCompound: function (compound) {
        elementsArray.map(item => {
            var el = document.querySelector(`#${item.element_name}-${item.barcode_value}`);
            el.setAttribute("visible", false);
        });

        // Mostrar compuesto
        var compound = document.querySelector(`#${compound.name}-${compound.value}`);
        compound.setAttribute("visible", true);
    },
});
