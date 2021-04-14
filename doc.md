# **SCRIPT QUALTRICS**
​
## Parte I : utilità
​
Inserisci questo script nella console per visualizzare gli id delle singole domande sulla pagina:
​
``` javascript
jQuery('div[questionId]').each(function(a,b,c){
    console.log(jQuery(this).attr("questionId"));
    jQuery(this).prepend(jQuery(this).attr("questionId"));
});
​
```
Inserisci questo script nella console per visualizzare in testa ad ogni cella l'id dell'input della domanda:
​
```javascript
if (new URL(window.location.href).searchParams.get("Q_CHL") === "preview") {
    jQuery("table input").each(function () {
        jQuery(this).before(jQuery(this).attr("id"))
    })
}
```
​
## Parte II
​
### Formula Btot06 riga 1 & Riga 3
Per la riga 1 inserisci questo script nell'onReady, per la riga 3 sostituisci in columnIds ed in destination gli id degli input che servono come menzionato nella formula in excel seguendo lo stesso ordine.
Lo script funziona per tutta la riga dando solo gli id che servono alla prima cella
​
```javascript
​
var columnIds = [
    'QR~QID15~6~1~TEXT', //cella b13
    'QR~QID18~3~1~TEXT', //cella b48
    'QR~QID21~1~1~TEXT', //cella b78
    'QR~QID24~3~1~TEXT', //cella b106
    'QR~QID27~10~1~TEXT' //cella b141
];
var destination = "QR~QID30~1~1~TEXT"; //cella b173
var selectors = [];
var destinations = [];
var columns = [];
var values = [];
​
function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
}
function selectorParser(value, column){
    value = (value.slice(0, -6) + column + '~TEXT').replaceAll('~', '\\~');
    return value
}
​
function firstRowOperation(e){
    console.log('firstRow called from ', e.target.id)
    var column = columnExtractor(e.target.id);
    values.length = 0;
    selectors[column].map(entry => {
        console.log('mapping ', entry);
        values.push(jQuery("#"+entry).val())
    })
    values = values.map(entry =>  entry = entry.replaceAll('.', ''));
    var total = values.map(Number).reduce((a,b) => {return a+b}, 0);
    jQuery("#" + destinations[column]).val(total);
}
​
for(let i = 1; i <9; i++){
    selectors[i] = new Array();
    columnIds.map(key => {
        var parsed = selectorParser(key, i);
        jQuery("#" + parsed).on('change', firstRowOperation);
        selectors[i].push(parsed);
    })
    var parsedDestination = selectorParser(destination, i);
    destinations[i] = parsedDestination;
}
​
​
```
### Btot06 Riga 2 & Riga 4
​
Questa è per la riga 2, per la riga 4 riportare in columnIds, multiplierIds, dividerId e destination gli di delle celle menzionati nel file excel riguardo alla prima casella.
​
```javascript
​
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
​
var dividerId = 'QR~QID30~1~1~TEXT'; //cella b173
​
var destination = "QR~QID30~2~1~TEXT"; //cella b173
var selectors = [];
var destinations = [];
var multipliers = [];
var dividers = [];
var columns = [];
var values = [];
function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
}
function selectorParser(value, column){
    value = (value.slice(0, -6) + column + '~TEXT').replaceAll('~', '\\~');
    return value
}
function valueParser(value){
    value = parseInt(value.replaceAll('.', ''));
    if(isNaN(value)) return 0
    else return value
}
function infinityChecker(value){
    if (isNaN(value) || !isFinite(value)) return 0
    else return value
}
function secondRowOperation(e){
    var column = columnExtractor(e.target.id);
    values.length = 0;
    for(let i = 0; i < 5; i++){
        var one =  jQuery("#" + selectors[column][i]).val();
        var two = jQuery("#" + multipliers[column][i]).val();
        var product = valueParser(one) * valueParser(two);
        values.push(product)
    }
    var sum = values.reduce((a,b) => {return a+b}, 0);
    var divisionUnit = valueParser(jQuery("#" + dividers[column]).val());
    var partial = sum / divisionUnit;
    var total = infinityChecker(partial);
    jQuery("#" + destinations[column]).val(total);
}
​
for(let i = 1; i <9; i++){
    selectors[i] = new Array();
    columnIds.map(key => {
        var parsed = selectorParser(key, i);
        jQuery("#" + parsed).on('change', secondRowOperation);
        selectors[i].push(parsed);
    })
    multipliers[i] = new Array();
    multiplierIds.map(key => {
        var multiParsed = selectorParser(key, i);
        jQuery("#" + multiParsed).on('change', secondRowOperation);
        multipliers[i].push(multiParsed);
    })
    var dividerParsed = selectorParser(dividerId, i);
        jQuery("#" + dividerParsed).on('change', secondRowOperation);
    dividers[i] = dividerParsed;
    var parsedDestination = selectorParser(destination, i);
    destinations[i] = parsedDestination;
}
​
​
​
```
## Btot06 riga 5 Totali
Automatica
​
```javascript
​
var inputs = jQuery("#QID30 input")
​
var columns = [];
​
function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
}
​
function valueParser(value){
    value = parseInt(value.replaceAll('.', ''));
    if(isNaN(value)) return 0
    else return value
}
​
function thirdRowOperation(e){
    var column = columnExtractor(e.target.id);
    var one = jQuery(columns[column][0]).val();
    var two = jQuery(columns[column][2]).val();
    var total = valueParser(one) + valueParser(two);
    jQuery(columns[column][4]).val(total);
}
​
for(let i = 0; i < 40; i++){
    var test = i%8 +1;
    if (columns[test] == undefined) columns[test] = new Array();
    columns[test].push(inputs[i]);
}
columns.map((array, index) => {
    array.map((element, ind) => {
        if(ind == 0 || ind == 2) jQuery(element).on('change', thirdRowOperation);
    })
})
​
​
```
## Btot 06 riga 6 (Percentuali)
Automatica
​
```javascript
var inputs = jQuery("#QID30 input")
​
var columns = [];
for(let i = 0; i < 40; i++){
    var test = i%8 +1;
    if (columns[test] == undefined) columns[test] = new Array();
    columns[test].push(inputs[i]);     
}
function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
}
​
function operation(e){
    var column = columnExtractor(e.target.id);
    var values = new Array();
    for(let i = 0; i < 6; i++){
        values[i] = jQuery(columns[column][i]).val();
    };
    values = values.map(Number);
    var total = (values[0] * values[1] + values[2] * values[3]) / values[4];
    isNaN(total) ?  jQuery("#QR\\~QID30\\~6\\~" + column + "\\~TEXT").val(0) : jQuery("#QR\\~QID30\\~6\\~" + column + "\\~TEXT").val(total)
}
​
columns.map((array, index) => {
    array.map((entry => {
        jQuery(entry).on("change", operation)
    }))
})
​
```
​
## **Tutte le domande**
### Somma valori in riga dei totali, blocca input di testo
​
Per questa bisogna inserire l'id di ciascuna domanda. Una volta messo nell'onReady si applica a quella domanda;
​
```javascript
var id = "QID15";
​
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
​
        if(evt.which < 48 || evt.which > 57){
            console.log("ev.with",evt.which);
            evt.preventDefault();
            return false;
        }
​
    });
    jQuery(this).on("keyup",function(evt){
                
                jQuery(this).val(function(index, value) {
                    console.log("value",value);
                    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                });
                console.log('input columns', inputColumns)
​
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
​
                    }
                    total = sums[columnIndex].reduce((a, b) => a+b, 0);
                    console.log('total ', total)
                    jQuery("#QR\\~"+ id + "\\~"+totalsPosition+"\\~"+(columnIndex+1)+"\\~TEXT").val(total.toLocaleString())
                } 
            
    })
});
```
​
### Trasferimento di dati tra celle
Sempre nell'onReady, aggiunge un keyup a inputId e outputId, ogni volta che cambia input il valore viene copiato in output.
```javascript
​
function stringFormatter (string) {
    var first = string.replaceAll("\~","\\~");
    var output =first;
    return output
}
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

/* 
    snippet da replicare per ogni coppia in celle
    usare un numero progressivo per i successivi

    es. inputId1 inputId2

*/
​var inputId = "QR~QID15~1~1~TEXT";
var outputId = "QR~QID15~1~2~TEXT";

jQuery('#' + stringFormatter(inputId)).mirror('#' + stringFormatter(outputId))

```