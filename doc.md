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
## Btot06

Quelle che seguono sono le formule per compilare in automatico i campi della domanda btot06, dal momento che condividono i nomi delle funzioni e delle variabili, per inserirle tutte contemporaneamente oltre a seguire le indicazioni per ciascuna formula per la compilazione dei vari id, è necessario usare nomi diversi per gli array e le variabili in cui sono inseriti onde evitare conflitti.
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
    var column = columnExtractor(e.target.id);
    values.length = 0;
    selectors[column].map(entry => {
        values.push(jQuery("#"+entry).val())
    })
    values = values.map(entry =>  entry = entry.replaceAll('.', ''));
    var total = values.map(Number).reduce((a,b) => {return a+b}, 0);
    jQuery("#" + destinations[column]).val(total);
}
​
for(let i = 5; i <9; i++){
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
for(let i = 5; i <9; i++){
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
var inputs = jQuery("#QID30 input")​;
var columns = [];
​
function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
};
​
function valueParser(value){
    value = parseInt(value.replaceAll('.', ''));
    if(isNaN(value)) return 0
    else return value
};
​
function thirdRowOperation(e){
    var column = columnExtractor(e.target.id);
        var one = jQuery(columns[column][0]).val();
        var two = jQuery(columns[column][2]).val();
        var total = valueParser(one) + valueParser(two);
        jQuery(columns[column][4]).val(total);
};
​
for(let i = 0; i < 40; i++){
    var test = i%8 +1;
    if (columns[test] == undefined) columns[test] = new Array();
    columns[test].push(inputs[i]);
};

columns.map((array, index) => {
    if(index > 4){
        array.map((element, ind) => {
        if(ind == 0 || ind == 2) jQuery(element).on('change', thirdRowOperation);
        })
    }
});
​
​
```
## Btot 06 riga 6 Percentuali
Automatica
​
```javascript
var inputs = jQuery("#QID30 input");
var skipped = [0, 1 , 2 , 3];

var columns = [];
var storeValues = [];

function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
};

function valueParser(value){
    value = parseInt(value.replaceAll('.', ''));
    if(isNaN(value)) return 0
    else return value
};
function infinityChecker(value){
    if (isNaN(value) || !isFinite(value)) return 0
    else return value
};

function sixthRowOperation(e){
    var column = columnExtractor(e.target.id);
    storeValues.length = 0;
    columns[column].map(entry => {
        storeValues.push(jQuery(entry).val());
    });
    storeValues = storeValues.map(entry => {
        return valueParser(entry)
    });    
    var total = (storeValues[0] * storeValues[1] + storeValues[2] * storeValues[3]) / storeValues[4];
    jQuery(columns[column][5]).val(infinityChecker(total)); 
};

for(let i = 0; i < 48; i++){
    var test = i%8 +1;
    if (columns[test] == undefined) columns[test] = new Array();
    columns[test].push(inputs[i]);
    if(i < 40 && !skipped.includes(i%8)) jQuery(inputs[i]).on('change', sixthRowOperation);
};
​
​
```
## Formule Btot07

### Riga 1 e 3
L'esempio è funzionante per la riga 1, inserendo gli id delle celle B48 B59 B78 B87 B106 B115 B141 B157 in cellsToSum
e cambiando destination in "QR~QID31~3~1~TEXT" la formula funziona anche per la riga 3.
```javascript
var cellsToSum = [
    "QR~QID15~6~1~TEXT", //cella b13
    "QR~QID184~6~1~TEXT" //cella b27
];

var destination = "QR~QID31~1~1~TEXT"; //cella b183
var columnsToSum = [];
var destinations = [];
var storedValues = [];
function selectorParser(value, column){
    value = (value.slice(0, -6) + column + '~TEXT').replaceAll('~', '\\~');
    return value
}
function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
}
 function valueArrayParser(array){
    array = array.map(entry => { return entry.replaceAll('.', '')});
    array = array.map(Number);
    return array
} 
function firstRowOperation(e){
    var column = columnExtractor(e.target.id);
    storedValues = [];
    storedValues.push(jQuery("#" + columnsToSum[column][0]).val());
    storedValues.push(jQuery("#" + columnsToSum[column][1]).val());
    storedValues = valueArrayParser(storedValues);
    var total = storedValues.reduce((a, b) => {return a+b}, 0);
    jQuery("#" + destinations[column]).val(total)
}

for(let i = 1; i < 9; i++){
    if(columnsToSum[i] == undefined) columnsToSum[i] = new Array();
    var parsed = cellsToSum.map(key => {return selectorParser(key, i)});
    columnsToSum[i] = parsed
    var destParsed = selectorParser(destination, i);
    destinations[i] = destParsed;
}

columnsToSum.map((array, index) => {
    if(index > 4){
        array.map(key => {
            jQuery("#" + key).on('change', firstRowOperation)
        });
    };
})
```

### Riga 2 

Automatica, lenta
```javascript
var inputs = [
    "QR~QID15~6~1~TEXT", //cella b13
    "QR~QID15~7~1~TEXT", //cella b14
    "QR~QID184~6~1~TEXT", //cella b27
    "QR~QID184~7~1~TEXT" //cella b28
];

var divider = "QR~QID31~1~1~TEXT"; //cella b183
var destination = "QR~QID31~2~1~TEXT"; //cella b184

var columns = [];
var dividers = [];
var destinations = [];
var storedValues = [];

function selectorParser(value, column){
    value = (value.slice(0, -6) + column + '~TEXT').replaceAll('~', '\\~');
    return value
};

function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
};
function valueArrayParser(array){
    array = array.map(entry => { return entry.replaceAll('.', '')});
    array = array.map(Number);
    return array
};
function infinityChecker(value){
    if (isNaN(value) || !isFinite(value)) return 0
    else return value
};

function secondRowFunction(e){
    var column = columnExtractor(e.target.id);
    storedValues = [];
    storedValues[0] = jQuery("#" + columns[column][0]).val();
    storedValues[1] = jQuery("#" +columns[column][1]).val();
    storedValues[2] = jQuery("#" + columns[column][2]).val();
    storedValues[3] = jQuery("#" + columns[column][3]).val();
    storedValues = valueArrayParser(storedValues);
    var divisionUnit = jQuery("#" + dividers[column]).val();
    divisionUnit = parseInt(divisionUnit.replaceAll('.', ''))
    var total = (storedValues[0] * storedValues[1] + storedValues[2] * storedValues[3]) / divisionUnit;
    jQuery("#" + destinations[column]).val(infinityChecker(total));
};

for(let i = 5; i < 9 ; i++){
    if(columns[i] === undefined) columns[i] = new Array();
    
        var tempArray = inputs.map(input => {
            var val =  selectorParser(input, i);
            jQuery("#" + val).on('click', secondRowFunction);
            return val
        });
    columns[i] = tempArray;
    destinations[i] = selectorParser(destination, i);
    dividers[i] = selectorParser(divider, i);
    jQuery("#" + dividers[i]).on('click', secondRowFunction);
};
```
### Riga 4 
Automatica, lenta
```javascript
var firstOp = [
    "QR~QID18~3~1~TEXT", //b48
    "QR~QID185~3~1~TEXT", //b59
    "QR~QID21~1~1~TEXT",//b78
    "QR~QID22~3~1~TEXT", //b87
    "QR~QID24~3~1~TEXT", //b106
    "QR~QID25~3~1~TEXT", //b115
    "QR~QID27~10~1~TEXT", //b141
    "QR~QID186~10~1~TEXT"//b157
];

var secondOp = [
    "QR~QID18~4~1~TEXT", //b49
    "QR~QID185~4~1~TEXT", //b60
    "QR~QID21~2~1~TEXT",//b79
    "QR~QID22~4~1~TEXT", //b88
    "QR~QID24~4~1~TEXT", //b107
    "QR~QID25~4~1~TEXT", //b116
    "QR~QID27~11~1~TEXT",//b142
    "QR~QID186~11~1~TEXT"//b158
];

var divider = "QR~QID31~3~1~TEXT"; //cella b185
var destination = "QR~QID31~4~1~TEXT"; //cella b186

var columns = [];
var multipliers = [];
var dividers = [];
var destinations = [];
var storedColumn = [];
var storedMultipliers = [];
var storedProducts = [];

function selectorParser(value, column){
    value = (value.slice(0, -6) + column + '~TEXT').replaceAll('~', '\\~');
    return value
};

function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
};

function valueExtractor(value){
    value = jQuery("#" + value).val();
    value = value.replaceAll('.', '');
    value = parseInt(value);
    if(isNaN(value)) return 0
    else return value
};

function infinityChecker(value){
    if (isNaN(value) || !isFinite(value)) return 0
    else return value
};

function fourthRowFunction(e){
    console.log('starting')
    var column = columnExtractor(e.target.id);
    storedColumn.length = 0;
    storedMultipliers.length = 0;
    storedProducts.length = 0;
    storedColumn = columns[column].map(entry => {return valueExtractor(entry)});
    storedMultipliers = multipliers[column].map(entry => {return valueExtractor(entry)});
    storedProducts = storedColumn.map((entry, index) => {return entry * storedMultipliers[index]});
    var sum = storedProducts.reduce((a,b) => {return a+b}, 0);
    var divisionUnit = valueExtractor(dividers[column]);
    var total = infinityChecker(sum / divisionUnit);
    jQuery("#" + destinations[column]).val(total);
    console.log('done')
};

for(let i = 5; i < 9 ; i++){
    if(columns[i] === undefined) columns[i] = new Array();
    if(multipliers[i] === undefined) multipliers[i] = new Array();
    var tempArray = firstOp.map(input => {
        var val =  selectorParser(input, i);
            jQuery("#" + val).on('click', fourthRowFunction);
        return val
    });
    columns[i] = tempArray;
    var tempMulti = secondOp.map(input => {
        var mul = selectorParser(input, i);
            jQuery("#" + mul).on('click', fourthRowFunction)
        return mul
    });
    multipliers[i] = tempMulti;
    destinations[i] = selectorParser(destination, i);
    dividers[i] = selectorParser(divider, i);
};

dividers.map(entry => {
    jQuery("#" + entry).on('click', fourthRowFunction)
})
```

### Riga 5 Totali
Automatica
```javascript

var inputs = jQuery("#QID31 input");

var columns = [];

function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
};

function valueParser(value){
    value = parseInt(value.replaceAll('.', ''));
    if(isNaN(value)) return 0
    else return value
};

function thirdRowOperation(e){
    var column = columnExtractor(e.target.id);
    var one = jQuery(columns[column][0]).val();
    var two = jQuery(columns[column][2]).val();
    var total = valueParser(one) + valueParser(two);
    jQuery(columns[column][4]).val(total);
};

for(let i = 0; i < 40; i++){
    var test = i%8 +1;
    if (columns[test] == undefined) columns[test] = new Array();
    columns[test].push(inputs[i]);
};
columns.map((array, index) => {
    if(index > 4){
        array.map((element, ind) => {
            if(ind == 0 || ind == 2) jQuery(element).on('change', thirdRowOperation);
        });
    };
});

```
 ### Riga 6 Percentuali
 Automatica​

```javascript

var inputs = jQuery("#QID31 input");

var columns = [];
var storeValues = [];

function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
};

function valueParser(value){
    value = parseInt(value.replaceAll('.', ''));
    if(isNaN(value)) return 0
    else return value
};
function infinityChecker(value){
    if (isNaN(value) || !isFinite(value)) return 0
    else return value
};

function sixthRowOperation(e){
    var column = columnExtractor(e.target.id);
    if(column > 4){
    storeValues.length = 0;
    columns[column].map(entry => {
        storeValues.push(jQuery(entry).val());
    });
    storeValues = storeValues.map(entry => {
        return valueParser(entry)
    });    
    var total = (storeValues[0] * storeValues[1] + storeValues[2] * storeValues[3]) / storeValues[4];
    jQuery(columns[column][5]).val(infinityChecker(total)); 
    };
};

for(let i = 0; i < 48; i++){
    var test = i%8 +1;
    if (columns[test] == undefined) columns[test] = new Array();
    columns[test].push(inputs[i]);
    if(i < 40) jQuery(inputs[i]).on('change', sixthRowOperation); 
};
​
```
## Sezione D ##
### D02A, D02B - Impostare convalida data nella forma mm/aaaa
Inserire nella relativa domanda
```javascript
jQuery("#QR\\~1_QID136").attr("type", "date")

jQuery("#QR\\~1_QID137").attr("type", "date")
```

## **Tutte le domande**

### Eliminare popup di conferma quando si preme il tasto indietro
Da inserire in ogni domanda, il tasto indietro porta automaticamente indietro senza popup di conferma.

```javascript
var observer = new MutationObserver(function() {
    
    const div = document.querySelector("#Page > div > div.PageErrorDialog.TOC");
    if (div) {
        div.style.display = "none";
        jQuery("#Page > div > div.PageErrorDialog.TOC > div.ErrorButtons > button:nth-child(1)").trigger('click');
        observer.disconnect();
        observer = null;
    }
});
observer.observe(document.querySelector("#Page"), {
    childList: true,
    subtree: true
});

```
### Somma valori in riga dei totali, blocca input di testo, copia dei valori totali in altra tabella
​
Da inserire in ogni domanda specificando in id l'id della domanda e in outerDestinations gli id delle celle in cui devono essere copiati i totali.
Nel codice d'esempio le colonne da 5 a 8 della domanda QID15 si sommano in automatico e si trasferiscono in automatico nella cella corrispondente sulla prima riga della domanda QID17.
​
```javascript
var id = "QID15";
var outerDestinations = [
    'QR~QID17~1~5~TEXT',
    'QR~QID17~1~6~TEXT',
    'QR~QID17~1~7~TEXT',
    'QR~QID17~1~8~TEXT'
];

var skipped = [0, 1 , 2 , 3];
var inputs = jQuery("#" + id + " input");
var table = jQuery("#" + id + " table tr");
var inputColumns = jQuery(table[0]).children().length -1;
var totalsPosition = jQuery(jQuery("#" + id + " table tbody")[0]).children().length -1;
var columns = [];
var tester = inputColumns * (totalsPosition -1);
var realInputs = inputs.map((a, b) => { 
    if(!skipped.includes(a % inputColumns)) return b
}).slice(0, -inputColumns);
var totals = inputs.map((a,b) => {
    if(!skipped.includes(a % inputColumns))return b
}).slice(-inputColumns).slice(0,-inputColumns/2);
outerDestinations = outerDestinations.map(entry => { return entry.replaceAll("~", "\\~")});
function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
};
function rowExtractor(value){
    value = value.replaceAll("QR~" + id + "~", '');
    if(value[1]=='~')return parseInt(value[0]);
    else return parseInt(value[0]+value[1]);
};
function elaborateSum(array){
    array = array.map(entry => { return entry.replaceAll('.', '')});
    var value = array.map(Number).reduce((a,b) => {return a+b});
    return value
};

jQuery(realInputs).each(function(i,b){
    //prevent text input
    jQuery(this).on("keypress",function(evt){
                if(evt.which < 48 || evt.which > 57){
                    evt.preventDefault();
                    return false;
                }
            });
    //format input
    jQuery(this).on("keyup",function(evt){
        jQuery(this).val(function(index, value) {
            return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        });​
    });
    //store value in array
    jQuery(this).on('change', function(evt){
        var inputValue = (jQuery(this).val());
        var column = columnExtractor(jQuery(this).attr('id'));
        var totalsIndex = column - (inputColumns / 2)  -1;
        var row = rowExtractor(jQuery(this).attr('id'));
        if(columns[column] == undefined) columns[column] = new Array();
        columns[column][row -1] = inputValue;
        var total = elaborateSum(columns[column]);
        jQuery(totals[totalsIndex]).val(total);
        jQuery("#" + outerDestinations[totalsIndex]).val(total)
    });
});
```
​
