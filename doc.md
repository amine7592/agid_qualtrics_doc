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

## SEZIONE A - Riepilogo Dati in excel

in onLoad dell'intestazione della domanda
```javascript
var body = jQuery("#SurveyEngineBody");
body.prepend('<script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>');
```
​
in onReady dell'intestazione della domanda
```javascript
    
    var observer = new MutationObserver(function() {
    const div = document.querySelector("#NextButton");
        if(div) {
            div.style.display = "none";
        }
    });
    observer.observe(document.querySelector("#Page"), {
        childList: true,
        subtree: true
    });

    var excelButton = "<div style='text-align: center; display: center'><input id='customButton' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='SALVA IN EXCEL' type='button' align='center'></input></div>";
    var fakeNext = "<input id='fakeNext' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='AVANTI' type='button' align='center'></input>"
    jQuery("#Footer").prepend(excelButton);
    jQuery('#Buttons').prepend(fakeNext);

    var topLabels = ['A1','B1','C1','D1','E1','F1', 'G1','H1','I1']; 
    var sideLabels = ['A1','A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15'] 
    jQuery('div[questionId]').each(function(a,b,c){
            ids.push("#" + jQuery(this).attr("questionId"));
    });

    function saveExcel(){
        var wb = XLSX.utils.book_new();
        var ids =[];
        var row = 0; 
        var sheets = [];
        ids.map(entry => {
            var test = document.querySelector(entry + " table");
            if(test !== null ){
                row = 5;
                var workbook = XLSX.utils.table_to_book(test);
                var firstRow = topLabels.map(label => {
                    if(workbook["Sheets"]["Sheet1"][label]) return workbook["Sheets"]["Sheet1"][label]['v'];
                }); 
                var sideRow = sideLabels.map(label => {
                    if(workbook["Sheets"]["Sheet1"][label]) return workbook["Sheets"]["Sheet1"][label]["v"];
                });
                firstRow = firstRow.filter(cell => cell !== undefined);
                sideRow = sideRow.filter(cell => cell != undefined);
                var inputs = jQuery(entry +  " input");
                var rows = [];

                inputs.map((index, input) => {
                    var checker =  (Math.floor(index / row)) +1;
                    if(rows[checker] == undefined) rows[checker] = new Array();
                    rows[checker][0] = sideRow[checker];
                    rows[checker].push(jQuery(input).val())
                });
                rows[0] = firstRow;
                var titleRow = [jQuery( entry + " legend")[0].innerText ];
                rows.unshift(titleRow);
                rows.push([]);
                sheets = sheets.concat(rows);     
            };
            if(test == null){
                //li to sheet
                var title = [jQuery( entry + " h3").text()] ; 
                var choise = [jQuery(entry + " .q-checked").text()];  
                var arr = [title, choise, []];
                sheets = sheets.concat(arr);

            };
        });
        var sheetTitle = 'Sezione ' + jQuery(" h2").text().slice(0, 1);
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheets), sheetTitle);
        XLSX.writeFile(wb, 'sezione A.xlsx');

    };

    function storeLocalSheet(){
        var wb = XLSX.utils.book_new();
        var ids =[];
        var row = 0; 
        var sheets = [];
        ids.map(entry => {
            var test = document.querySelector(entry + " table");
            if(test !== null ){
                row = 5;
                var workbook = XLSX.utils.table_to_book(test);
                var firstRow = topLabels.map(label => {
                    if(workbook["Sheets"]["Sheet1"][label]) return workbook["Sheets"]["Sheet1"][label]['v'];
                }); 
                var sideRow = sideLabels.map(label => {
                    if(workbook["Sheets"]["Sheet1"][label]) return workbook["Sheets"]["Sheet1"][label]["v"];
                });
                firstRow = firstRow.filter(cell => cell !== undefined);
                sideRow = sideRow.filter(cell => cell != undefined);
                var inputs = jQuery(entry +  " input");
                var rows = [];
                inputs.map((index, input) => {
                    var checker =  (Math.floor(index / row)) +1;
                    if(rows[checker] == undefined) rows[checker] = new Array();
                    rows[checker][0] = sideRow[checker];
                    rows[checker].push(jQuery(input).val())
                });
                rows[0] = firstRow;
                var titleRow = [jQuery( entry + " legend")[0].innerText ];
                rows.unshift(titleRow);
                rows.push([]);
                sheets = sheets.concat(rows);     
            };
            if(test == null){
                //li to sheet
                var title = [jQuery( entry + " h3").text()] ; 
                var choise = [jQuery(entry + " .q-checked").text()];  
                var arr = [title, choise, []];
                sheets = sheets.concat(arr);
            }
        });
        var sheetTitle = 'Sezione ' + jQuery(" h2").text().slice(0, 1);
        var sezionea = XLSX.utils.aoa_to_sheet(sheets);
        localStorage.setItem('sezionea', JSON.stringify(sezionea));
        jQuery("#NextButton").trigger('click');
    };

jQuery('#excelButton').on('click', saveExcel);
jQuery("#fakeNext").on('click', storeLocalSheet);
```

## SEZIONE B

### Riepilogo dati in Excel
in addOnLoad : 
```javascript
var body = jQuery("#SurveyEngineBody");
body.prepend('<script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>');
```

in onReady: 
```javascript
    var observer = new MutationObserver(function() {
    const div = document.querySelector("#NextButton");
        if(div) {
            div.style.display = "none";
        };
    });
    observer.observe(document.querySelector("#Page"), {
        childList: true,
        subtree: true
    });

    var excelButton = "<div style='text-align: center; display: center'><input id='customButton' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='SALVA IN EXCEL' type='button' align='center'></input></div>";
    var fakeNext = "<input id='fakeNext' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='AVANTI' type='button' align='center'></input>"

    jQuery("#Footer").prepend(excelButton);
    jQuery('#Buttons').prepend(fakeNext);

    var topLabels = ['A1','B1','C1','D1','E1','F1', 'G1','H1','I1']; 
    var sideLabels = ['A1','A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15'] 
    var ids = [];
    jQuery('div[questionId]').each(function(a,b,c){
        ids.push("#" + jQuery(this).attr("questionId"));
    });
    ids = ids.map(entry => {if(document.querySelector(entry + " table") !== null) return entry});
    ids = ids.filter(entry => entry !== undefined);

function saveExcel(){
    var sheets = [];
    var wb = XLSX.utils.book_new(); 
    var row = 0; 
    var columns = 0;

    ids.map(entry => {
        columns = jQuery( entry +" table thead tr").children().length-1;
        row = jQuery(entry + " tr").length -1;
        var workbook = XLSX.utils.table_to_book(document.querySelector(entry + " table"));
        var firstRow = topLabels.map(label => {
            if(workbook["Sheets"]["Sheet1"][label]) return workbook["Sheets"]["Sheet1"][label]['v'];
        }); 
        var sideRow = sideLabels.map(label => {
            if(workbook["Sheets"]["Sheet1"][label]) return workbook["Sheets"]["Sheet1"][label]["v"];
        });
        firstRow = firstRow.filter(cell => cell !== undefined);
        sideRow = sideRow.filter(cell => cell != undefined);
        var inputs = jQuery(entry +  " input");
        var rows = []; 
        inputs.map((index, input) => {
            var checker =  (Math.floor(index / columns)) +1;
            if(rows[checker] == undefined) rows[checker] = new Array();
            rows[checker][0] = sideRow[checker];
            rows[checker].push(jQuery(input).val())
        });
        rows[0] = firstRow;
        var titleRow = [jQuery( entry + " legend")[0].innerText ];
           rows.unshift(titleRow);
        rows.push([]);
        sheets = sheets.concat(rows);         
    });
    var sheetTitle = 'Sezione B';
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheets), sheetTitle);
    XLSX.writeFile(wb, 'sezione B.xlsx'); 
};

function storeLocalSheet(){
    var sheets = [];
    var wb = XLSX.utils.book_new(); 
    var row = 0; 
    var columns = 0;

    ids.map(entry => {
        columns = jQuery( entry +" table thead tr").children().length-1;
        row = jQuery(entry + " tr").length -1;
        var workbook = XLSX.utils.table_to_book(document.querySelector(entry + " table"));
        var firstRow = topLabels.map(label => {
            if(workbook["Sheets"]["Sheet1"][label]) return workbook["Sheets"]["Sheet1"][label]['v'];
        }); 
        var sideRow = sideLabels.map(label => {
            if(workbook["Sheets"]["Sheet1"][label]) return workbook["Sheets"]["Sheet1"][label]["v"];
        });
        firstRow = firstRow.filter(cell => cell !== undefined);
        sideRow = sideRow.filter(cell => cell != undefined);
        var inputs = jQuery(entry +  " input");
        var rows = []; 
        inputs.map((index, input) => {
            var checker =  (Math.floor(index / columns)) +1;
            if(rows[checker] == undefined) rows[checker] = new Array();
            rows[checker][0] = sideRow[checker];
            rows[checker].push(jQuery(input).val())
        });
        rows[0] = firstRow;
        var titleRow = [jQuery( entry + " legend")[0].innerText ];
           rows.unshift(titleRow);
        rows.push([]);
        sheets = sheets.concat(rows);         
    });
        
    var sheetTitle = 'Sezione B';
    var sezioneb = XLSX.utils.aoa_to_sheet(sheets);
    localStorage.setItem('sezioneb', JSON.stringify(sezioneb));
    jQuery("#NextButton").trigger('click'); 
};

jQuery('#excelButton').on('click', saveExcel);
jQuery('#fakeNext').on('click', storeLocalSheet);

```
### Btot 06 tutte le formule

Codice completo per la domanda Btot06 "Totale spesa per canale d'acquisto", riutilizzabile con la Btot07 cambiando gli id con le celle menzionate nell'excel complementare.

```javascript

// funzioni condivise da non modificare, qualora si riutilizzi in un'altra domandail codice di una riga in un'altra sezione è necessario copiare le funzioni che vi vengono menzionate
function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
};
function selectorParser(value, column){
    value = (value.slice(0, -6) + column + '~TEXT').replaceAll('~', '\\~');
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
	/* RIGA 01 */
    //per adattare a btot07 e simili inserire id della prima colonna da manipolare, ricava le altre colonne in automatico
	var firstColumns = [
		'QR~QID15~8~1~TEXT', // tot b01
		'QR~QID18~5~1~TEXT', // tot b03
		'QR~QID21~3~1~TEXT', // tot b05
		'QR~QID24~3~1~TEXT', // tot b07
		'QR~QID27~10~1~TEXT' // tot b09
	];
	var firstDestination = "QR~QID30~1~1~TEXT"; // cella di destinazione prima colonna
	var firstSelectors = []; 
	var firstDestinations = [];
	var firstValues = [];
	function firstRow(e){
		var firstColumn = columnExtractor(e.target.id);
		firstValues.length = 0;
		firstSelectors[firstColumn].map(entry => {
			firstValues.push(jQuery("#"+entry).val()); 
		});
		firstValues = firstValues.map(entry =>  entry = entry.replaceAll('.', ''));
		var firstTotal = firstValues.map(Number).reduce((a,b) => {return a+b}, 0);
		jQuery("#" + firstDestinations[firstColumn]).val(firstTotal).trigger('change'); 
	};
	for(let i = 5; i <9; i++){
		firstSelectors[i] = new Array();
		firstColumns.map(entry => {
			var parsed = selectorParser(entry, i);
			jQuery("#" + parsed).on('change', firstRow);
			firstSelectors[i].push(parsed);
		});
		var parsedDestination = selectorParser(firstDestination, i);
		firstDestinations[i] = parsedDestination;
	};
	/* RIGA 02 */
    //per adattare a btot07 e simili inserire id della prima colonna da manipolare, ricava le altre colonne in automatico
	var secondColumns = [
    'QR~QID15~8~1~TEXT', //tot b01
    'QR~QID18~5~1~TEXT', //tot b03
    'QR~QID21~3~1~TEXT', //tot b05 
    'QR~QID24~3~1~TEXT', //tot b07
    'QR~QID27~10~1~TEXT' //tot b09
	];
    //per adattare a btot07 e simili inserire id della prima colonna di moltiplicatori, ricava le altre colonne in automatico
	var secondMultipliers = [
		'QR~QID15~9~1~TEXT', //per b01
		'QR~QID18~6~1~TEXT', //per b03
		'QR~QID21~4~1~TEXT', //per b05
		'QR~QID24~4~1~TEXT', //per b07
		'QR~QID27~11~1~TEXT' //per b09
	];
	var secondDivider = 'QR~QID30~1~1~TEXT'; //riga 1 btot06
	var secondDestination = "QR~QID30~2~1~TEXT"; //riga 2 btot06
	var secondSelectors = [];
	var secondDestSelectors = [];
	var secondMultiSelectors = [];
	var secondDivSelectors = [];
	var secondValues = [];

	function secondRow(e){
		var column = columnExtractor(e.target.id);
		secondValues.length = 0;
		for(let i = 0; i < 5; i++){
			var one =  jQuery("#" + secondSelectors[column][i]).val();
			var two = jQuery("#" + secondMultiSelectors[column][i]).val();
			var product = valueParser(one) * valueParser(two);
			secondValues.push(product)
		};
		var sum = secondValues.reduce((a,b) => {return a+b}, 0);
		var divisionUnit = valueParser(jQuery("#" + secondDivSelectors[column]).val());
		var partial = sum / divisionUnit;
		var total = infinityChecker(partial);
		jQuery("#" + secondDestSelectors[column]).val(total).trigger('change');
	};

	for(let i = 5; i <9; i++){
		secondSelectors[i] = new Array();
		secondColumns.map(key => {
			var parsed = selectorParser(key, i);
			jQuery("#" + parsed).on('change', secondRow);
			secondSelectors[i].push(parsed);
		});
		secondMultiSelectors[i] = new Array();
		secondMultipliers.map(key => {
			var multiParsed = selectorParser(key, i);
			jQuery("#" + multiParsed).on('change', secondRow);
			secondMultiSelectors[i].push(multiParsed);
		});
		var dividerParsed = selectorParser(secondDivider, i);
			jQuery("#" + dividerParsed).on('change', secondRow);
		secondDivSelectors[i] = dividerParsed;
		var parsedDestination = selectorParser(secondDestination, i);
		secondDestSelectors[i] = parsedDestination;
	};
	/* RIGA 03 */
    //compe per riga 1
	var thirdColumns = [
    'QR~QID184~8~1~TEXT', // total b02
    'QR~QID185~5~1~TEXT', // total b04
    'QR~QID22~3~1~TEXT', // total b06
    'QR~QID25~3~1~TEXT', // total b08
    'QR~QID186~10~1~TEXT' // total b10
	];
	var thirdDestination = "QR~QID30~3~1~TEXT"; // btot06 riga 3
	var thirdSelectors = []; 
	var thirdDestinations = [];
	var thirdValues = [];
	function thirdRow(e){
		var thirdColumn = columnExtractor(e.target.id);
		thirdValues.length = 0;
		thirdSelectors[thirdColumn].map(entry => {
			thirdValues.push(jQuery("#"+entry).val()); 
		});
		thirdValues = thirdValues.map(entry =>  entry = entry.replaceAll('.', ''));
		var thirdTotal = thirdValues.map(Number).reduce((a,b) => {return a+b}, 0);
		jQuery("#" + thirdDestinations[thirdColumn]).val(thirdTotal).trigger('change'); 
	};
	for(let i = 5; i <9; i++){
		thirdSelectors[i] = new Array();
		thirdColumns.map(entry => {
			var parsed = selectorParser(entry, i);
			jQuery("#" + parsed).on('change', thirdRow);
			thirdSelectors[i].push(parsed);
		});
		var parsedDestination = selectorParser(thirdDestination, i);
		thirdDestinations[i] = parsedDestination;
	};
	/* RIGA 04 */ 
    //come per riga 2
	var fourthColumns = [
        'QR~QID184~8~1~TEXT', //tot b02
        'QR~QID185~5~1~TEXT', //tot b04
        'QR~QID22~3~1~TEXT', //tot b06 
        'QR~QID25~3~1~TEXT', //tot b08
        'QR~QID186~10~1~TEXT' //tot b10
    ];
    var fourthMultipliers = [
        'QR~QID184~9~1~TEXT', //per b02
        'QR~QID185~6~1~TEXT', //per b04
        'QR~QID22~4~1~TEXT', //per b06
        'QR~QID25~4~1~TEXT', //per b08
        'QR~QID186~11~1~TEXT' //per b10
    ];

    var fourthDivider = 'QR~QID30~3~1~TEXT'; //btot06 riga 3
    var fourthDestination = "QR~QID30~4~1~TEXT"; //btot06 riga 4
    var fourthSelectors = [];
    var fourthDestSelectors = [];
    var fourthMultiSelectors = [];
    var fourthDivSelectors = [];
    var fourthValues = [];

    function fourthRow(e){
        var column = columnExtractor(e.target.id);
        fourthValues.length = 0;
        for(let i = 0; i < 5; i++){
            var one =  jQuery("#" + fourthSelectors[column][i]).val();
            var two = jQuery("#" + fourthMultiSelectors[column][i]).val();
            var product = valueParser(one) * valueParser(two);
            fourthValues.push(product)
        };
        var sum = fourthValues.reduce((a,b) => {return a+b}, 0);
        var divisionUnit = valueParser(jQuery("#" + fourthDivSelectors[column]).val());
        var partial = sum / divisionUnit;
        var total = infinityChecker(partial);
        jQuery("#" + fourthDestSelectors[column]).val(total).trigger('change');
    };

    for(let i = 5; i <9; i++){
        fourthSelectors[i] = new Array();
        fourthColumns.map(key => {
            var parsed = selectorParser(key, i);
            jQuery("#" + parsed).on('change', fourthRow);
            fourthSelectors[i].push(parsed);
        });
        fourthMultiSelectors[i] = new Array();
        fourthMultipliers.map(key => {
            var multiParsed = selectorParser(key, i);
            jQuery("#" + multiParsed).on('change', fourthRow);
            fourthMultiSelectors[i].push(multiParsed);
        });
        var dividerParsed = selectorParser(fourthDivider, i);
            jQuery("#" + dividerParsed).on('change', fourthRow);
        fourthDivSelectors[i] = dividerParsed;
        var parsedDestination = selectorParser(fourthDestination, i);
        fourthDestSelectors[i] = parsedDestination;
    };
	/* RIGA 05 */
    //per adattare sostituire #QID30 nella prima riga con id della domanda di destinazione, es:  'var inputs = jQuery("#QID31 input")
	var inputs = jQuery("#QID30 input");
	var fifthColumns = [];

    function fifthRow(e){
		console.log('fifth called');
        var column = columnExtractor(e.target.id);
        var one = jQuery(fifthColumns[column][0]).val();
        var two = jQuery(fifthColumns[column][2]).val();
        var total = valueParser(one) + valueParser(two);
		
        jQuery(fifthColumns[column][4]).val(total).trigger('change');
    };

    for(let i = 0; i < 40; i++){
        var test = i%8 +1;
        if (fifthColumns[test] == undefined) fifthColumns[test] = new Array();
        fifthColumns[test].push(inputs[i]);
    };

    fifthColumns.map((array, index) => {
        if(index > 4){
            array.map((element, ind) => {
            if(ind == 0 || ind == 2) jQuery(element).on('change', fifthRow);
            })
        }
    });
	/* RIGA 06 */
    //riutilizza la prima riga della formula precedente, se importato in altra domanda senza di essa bisogna inserirla con l'id della domanda precedente
	var skipped = [0, 1 , 2 , 3];
    var sixthColumns = [];
    var sixthStoreValues = [];

    function sixthRow(e){
        var column = columnExtractor(e.target.id);
        sixthStoreValues.length = 0;
        sixthColumns[column].map(entry => {
            sixthStoreValues.push(jQuery(entry).val());
        });
        sixthStoreValues = sixthStoreValues.map(entry => {
            return valueParser(entry)
        });    
        var total = (sixthStoreValues[0] * sixthStoreValues[1] + sixthStoreValues[2] * sixthStoreValues[3]) / sixthStoreValues[4];
        total = infinityChecker(total);
        total = Math.round(total); //arrotondamento per difetto fino a 0,49, per eccesso da 0.50
        jQuery(sixthColumns[column][5]).val(total).trigger('change'); 
    };

    for(let i = 0; i < 48; i++){
        var test = i%8 +1;
        if (sixthColumns[test] == undefined) sixthColumns[test] = new Array();
        sixthColumns[test].push(inputs[i]);
        if(i < 40 && !skipped.includes(i%8)) jQuery(inputs[i]).on('change', sixthRow);
    };

    /* HEADER GRAFICO */
    var tHead = jQuery("#QID30 thead");
    var newHeader ="<tr><td></td><th colspan='4' style='background-color:#F0F6FC'>Rilevazione 2020</th><th colspan='4' style='background-color:#D0E2F5'>Rilevazione 2021</th></tr>" 
    tHead.prepend(newHeader)
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
    jQuery("#" + destinations[column]).val(total).trigger('change');
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
    jQuery("#" + destinations[column]).val(infinityChecker(total)).trigger('change');
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
    jQuery("#" + destinations[column]).val(total).trigger('change');
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
    jQuery(columns[column][4]).val(total).trigger('change');
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
    jQuery(columns[column][5]).val(infinityChecker(total)).trigger('change'); 
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

## Sezione B

### B11 Controllo valori 2a riga
Automatico valido per tutte e 4 le colonne, 
```javascript
	var inputs = jQuery("#QID187 input");
var columns = [];
var values = [];

function valueParser(value){
    if(isNaN(parseInt(value))) return 0
    else return parseInt(value)
}

function errorCheck(e){
    values.length = 0;
    values[0] = valueParser(jQuery(columns[1][0]).val());
    values[1] = valueParser(jQuery(columns[1][1]).val());
    values[2] = valueParser(jQuery(columns[2][0]).val());
    values[3] = valueParser(jQuery(columns[2][1]).val());
    values[4] = valueParser(jQuery(columns[3][0]).val());
    values[5] = valueParser(jQuery(columns[3][1]).val());
    values[6] = valueParser(jQuery(columns[4][0]).val());
    values[7] = valueParser(jQuery(columns[4][1]).val());
    
    if(values[0] < values[1]) {
		jQuery(columns[1][1]).val('');
		window.alert('ATTENZIONE : il valore della seconda riga non può essere maggiore del valore della prima');
	};
	if(values[2] < values[3]){
		jQuery(columns[2][1]).val('');
		window.alert('ATTENZIONE : il valore della seconda riga non può essere maggiore del valore della prima');
	};
    if(values[4] < values[5]) {
		jQuery(columns[3][1]).val('');
		window.alert('ATTENZIONE : il valore della seconda riga non può essere maggiore del valore della prima');
	};
    if(values[6] < values[7]) {
		jQuery(columns[4][1]).val('');
		window.alert('ATTENZIONE : il valore della seconda riga non può essere maggiore del valore della prima');
	};
};
for(let i = 0; i < 8; i++){
    var test = i%4 +1;
    if (columns[test] == undefined) columns[test] = new Array();
    columns[test].push(inputs[i]);
};

columns.map((array, index) => {
        array.map((element, ind) => {
            jQuery(element).on('change', errorCheck);
        })
});

```
Automatico, valido solo per le ultime due colonne;
```javascript
var inputs = jQuery("#QID187 input")​;
var columns = [];
var errorLabel = "<div id='errorLabel' style='background : red; text-align : center; color: white'> ATTENZIONE: Il valore nella seconda riga non può essere maggiore del valore inserito nella prima riga </div>";
function columnExtractor(value){
    value = parseInt(value.slice(value.length - 6).slice(0, 5));
    return value
};
function valueParser(value){
    value = parseInt(value.replaceAll('.', ''));
    if(isNaN(value)) return 0
    else return value
};
function errorCheck(e){
    var column = columnExtractor(e.target.id);
    var one = jQuery(columns[column][0]).val();
    var two = jQuery(columns[column][1]).val();
        var error = valueParser(one) < valueParser(two);
        if(error){
            jQuery("#errorLabel").show();
        }else{
            jQuery("#errorLabel").hide();
        }
};
for(let i = 0; i < 8; i++){
    var test = i%4 +1;
    if (columns[test] == undefined) columns[test] = new Array();
    columns[test].push(inputs[i]);
};

columns.map((array, index) => {
    if(index > 2){
        array.map((element, ind) => {
            jQuery(element).on('change', errorCheck);
        })
    }
});

jQuery("#QID187").append(errorLabel);
jQuery("#errorLabel").hide();

```

## **Tutte le domande**

## Impedimento input testo in ultima riga
Va indicato in **cells** il numero di celle nell'ultima riga della domanda da modificare.
```javascript
var id = "#QID15";
var cells = 8;
var inputs = jQuery(id + " input");
var lastRow = inputs.slice(-cells);
lastRow.each(function(){
    jQuery(this).on("keypress",function(evt){
                if(evt.which < 48 || evt.which > 57){
                    evt.preventDefault();
                    return false;
                };
            });
    jQuery(this).on('keyup', function(){
        if((parseInt(jQuery(this).val()) > 100){
            jQuery(this).val(100);
        };
    });
})

```

### Inserimento Headers grafici
​Esempio per la QID15
```javascript
var tHead = jQuery("#QID15 > div.Inner.BorderColor.TE > div > fieldset > div > table > thead");
var newHeader ="<tr><td></td><th colspan='4' style='background-color:#F0F6FC'>Rilevazione 2018</th><th colspan='4' style='background-color:#D0E2F5'>Rilevazione 2019</th></tr>" 
​
tHead.prepend(newHeader)
```
Per ogni domanda modificare l'id riportato nella variabile tHead( "#QID184, #QID21" etc), inserire questo codice per ultimo nell'onReady.
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
Per applicarla ad altre domande bisogna inoltre rimpiazzare a mano l'id della domanda all'interno della funzione rowExtractor (vedi commento)
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

function rowExtractor(value){;
    value = value.replaceAll("QR~", "");
	value = value.replaceAll("QID15~", "");
    //SOSTIRUIRE A MANO ID (ES value = value.replaceAll('QID187~', '');
    if(value[1]=='~')return parseInt(value[0]);
    else return parseInt(value[0] + value[1]);
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
        });
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
        jQuery(totals[totalsIndex]).val(total).trigger('change');
        jQuery("#" + outerDestinations[totalsIndex]).val(total).trigger('change'); 
    });
});

```

### Trasferimento di dati tra celle


Inserire questo snippet di codice in ogni domanda che contiene una matrice con calcolo automatico del totale.

```javascript
function stringFormatter(string) {
    string =  string.replaceAll("\~","\\~");
    return string
}
function copyValue(){
    var value = jQuery("#" + stringFormatter(inputId)).val();
    jQuery("#" + stringFormatter(outputId)).val(value)
}
``` 

 Ripetere questo snippet per ogni cella che si desidera copiare

```javascript
​var inputId = "QR~QID15~1~1~TEXT";
var outputId = "QR~QID15~1~2~TEXT";
jQuery("#" + stringFormatter(inputId)).on('change', copyValue)
```
```
​
