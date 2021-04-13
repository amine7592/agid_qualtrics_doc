# **SCRIPT QUALTRICS**

## Parte I : utilità

Inserisci questo script nella console per visualizzare gli id delle singole domande sulla pagina:

``` javascript
jQuery('div[questionId]').each(function(a,b,c){
    console.log(jQuery(this).attr("questionId"));
    jQuery(this).prepend(jQuery(this).attr("questionId"));
});

```
Inserisci questo script nella console per visualizzare in testa ad ogni cella l'id dell'input della domanda:

```javascript
if (new URL(window.location.href).searchParams.get("Q_CHL") === "preview") {
    jQuery("table input").each(function () {
        jQuery(this).before(jQuery(this).attr("id"))
    })
}
```

## Parte II

### Formula Btot06 riga 1
Per la riga 1 inserisci questo script nell'onReady, per la riga 3 sostituisci in columnIds ed in destination gli id degli input che servono come menzionato nella formula in excel seguendo lo stesso ordine.
Lo script funziona per tutta la riga dando solo gli id che servono alla prima cella

```javascript

var columnIds = [
    'QR~QID15~6~1~TEXT', //cella b13
    'QR~QID18~3~1~TEXT', //cella b48
    'QR~QID21~1~1~TEXT', //cella b78
    'QR~QID24~3~1~TEXT', //cella b106
    'QR~QID27~10~1~TEXT' //cella b141
];
var destination = "QR~QID30~1~1~TEXT"; //cella b173

var selectors = new Array();
var destinations = new Array();
var values = new Array();

function valueChanged(e){
    var id = e.target.id.slice;
    id = id.slice(id.length - 6);
    id = id.slice(0, 5);
    var column = parseInt(id);
    selectors[column].map(entry => {
        values.push(jQuery("#" + entry).val());
    });
    values = values.map(Number);
    var total = values.reduce((a,b) => {return a+b}, 0);
    jQuery("#" + destinations[column]).val(total)
}

for(let i = 1; i<9; i++){
    selectors[i] = new Array();
    columnIds.map(key => {
        var sliced = key.slice(0, -6);
        var column = sliced + i + '~TEXT';
        var parsed = column.replaceAll("~", "\\~");
            jQuery("#" + parsed).on('change', valueChanged) 
        selectors[i].push(parsed);
    })
    var sliceDestination = destination.slice(0, -6);
    var columnDestination = sliceDestination + i +'~TEXT';
    var parsedDestination = columnDestination.replaceAll("~", "\\~");
    destinations[i].push(parsedDestination);
}

```
### Formula Btot06 Riga 2

Come sopra, inserendo gli id manualmente si può usare anche per la riga 4

```javascript
var columnIds = [
        'QR~QID15~6~1~TEXT', //cella b13
        'QR~QID18~3~1~TEXT', //cella b48
        'QR~QID21~1~1~TEXT', //cella b78
        'QR~QID24~3~1~TEXT', //cella b106
        'QR~QID27~10~1~TEXT' //cella b141
    ];

    var multiplierIds = [
        'QR~QID15~7~1~TEXT', //cella b14
        'QR~QID18~4~1~TEXT', //cella b49
        'QR~QID21~2~1~TEXT', //cella b79
        'QR~QID24~4~1~TEXT', //cella b107
        'QR~QID27~11~1~TEXT' //cella b142
    ];
   
    var dividerId = 'QR~QID30~1~1~TEXT'; //cella b173

    var destination = "QR~QID30~2~1~TEXT"; //cella b174

    var selectors = new Array();
    var multipliers = new Array();
    var dividers = new Array();
    var destinations = new Array();

    function multiplyValueChanged(e){
    var id = e.target.id.slice;
    id = id.slice(id.length - 6);
    id = id.slice(0, 5);
    var column = parseInt(id);
    var values = new Array();
    for(let i = 1; i <selectors.length; i++){
        var valueOne = jQuery("#" + selectors[column][i]).val();
        var valueTwo = jQuert("#" + multipliers[column][i]).val();
        values.push(parseInt(valueOne) * parseInt(valueTwo));
    }
    var total = values.reduce((a,b) => {return a+b }, 0);
    isNaN(total / dividers[column]) ? (total = 0) : (total = total/dividers[column]);
    jQuery("#" + destinations[column]).val(total)
}

for(let i = 1; i<9; i++){
    selectors[i] = new Array();
    columnIds.map(key => {
        var sliced = key.slice(0, -6);
        var column = sliced + i + '~TEXT';
        var parsed = column.replaceAll("~", "\\~");
            jQuery("#" + parsed).on('change', multiplyValueChanged) 
        selectors[i].push(parsed);
    })
    multipliers[i] = new Array();
    multiplierIds.map(key => {
        var multiSliced = key.slice(0, -6);
        var multiColumn = multiSliced + i + '~TEXT';
        var multiParsed = multiColumn.replaceAll("~", "\\~");
            jQuery("#" + multiParsed).on('change', multiplyValueChanged)
        multipliers[i].push(multiParsed);
    })
    var sliceDestination = destination.slice(0, -6);
    var columnDestination = sliceDestination + i +'~TEXT';
    var parsedDestination = columnDestination.replaceAll("~", "\\~");
    destinations[i].push(parsedDestination);
    var sliceDivider = dividerId.slice(0, -6);
    var columnDivider = sliceDivider + i + '~TEXT';
    var parsedDivider = columnDivider.replaceAll("~", "\\~");
    dividers[i].push(parsedDivider);
}
```

### Somma valori in riga dei totali, blocca input di testo

Per questa bisogna inserire l'id di ciascuna domanda. Una volta messo nell'onReady si applica a quella domanda;

```javascript
var id = "QID15";

var inputs = jQuery("#"+id+ "> div.Inner.BorderColor.TE > div > fieldset > div > table input");
var table = jQuery("#"+id + " > div.Inner.BorderColor.TE > div > fieldset > div > table > tbody > tr");
var inputColumns = jQuery(table[0]).children().length -1
var totalsPosition = jQuery(jQuery("#"+id + " > div.Inner.BorderColor.TE > div > fieldset > div > table > tbody")[0]).children().length -1;
var columnCells = totalsPosition -1;
var  horizontalIndex = 0;
var columnIndex = 0;
var maximum = inputColumns * columnCells;
var sums = []
var total = 0;
jQuery(inputs).each(function(i,b){
    jQuery(this).on("keypress",function(evt){

        if(evt.which < 48 || evt.which > 57){
            console.log("ev.with",evt.which);
            evt.preventDefault();
            return false;
        }

    });
    jQuery(this).on("keyup",function(evt){
                
                jQuery(this).val(function(index, value) {
                    console.log("value",value);
                    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                });
                console.log('input columns', inputColumns)

                if(i < maximum){
                    horizontalIndex = Math.floor(i/inputColumns);
                    columnIndex = i - inputColumns * horizontalIndex;
                    if( sums[columnIndex] == undefined) {
                        sums[columnIndex] = new Array();
                        sums[columnIndex].length = columnCells;
                        isNaN(parseInt(this.value)) ? sums[columnIndex][horizontalIndex] = 0 : sums[columnIndex][horizontalIndex] = parseInt(this.value.replaceAll("\.",""));
                    } else {
                        sums[columnIndex][horizontalIndex] = this.value;
                        isNaN(parseInt(this.value)) ? sums[columnIndex][horizontalIndex] = 0 : sums[columnIndex][horizontalIndex] = parseInt(this.value.replaceAll("\.",""));

                    }
                    total = sums[columnIndex].reduce((a, b) => a+b, 0);
                    console.log('total ', total)
                    jQuery("#QR\\~"+ id + "\\~"+totalsPosition+"\\~"+(columnIndex+1)+"\\~TEXT").val(total.toLocaleString())
                } 
            
    })
});
```

### Trasferimento di dati tra celle
Sempre nell'onReady, aggiunge un keyup a inputId e outputId, ogni volta che cambia input il valore viene copiato in output.
```javascript
var inputId = "QR~QID15~1~1~TEXT";
var outputId = "QR~QID15~1~2~TEXT";

function stringFormatter (string) {
    var first = string.replaceAll("\~","\\\\~");
    var output =first;
    return output
}

var originalCell = stringFormatter(inputId);
var destinationCell = stringFormatter(outputId);

//funzione globale per trasferire dati tra celle
jQuery.fn.mirror = function (selector) {
    return this.each(function () {
        console.log('mirror called')
        var $this = jQuery(this);
        var $selector = jQuery(selector);
        jQuery(this).bind('keyup', function () { //'keyup'
            $selector.val(($this.val()));
        });
    });
};

jQuery('#' + originalCell).mirror('#' + destinationCell)
```
