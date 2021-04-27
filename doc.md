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
        };
    });
    observer.observe(document.querySelector("#Page"), {
        childList: true,
        subtree: true
    });

var excelButton = "<div style='text-align: center; display: center'><input id='excelButton' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='SALVA IN EXCEL' type='button' align='center'></input></div>";
var fakeNext = "<input id='fakeNext' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='AVANTI' type='button' align='center'></input>"

jQuery("#Footer").prepend(excelButton);
jQuery('#Buttons').prepend(fakeNext);


var ids = [];
    jQuery('div[questionId]').each(function(a,b,c){
        ids.push("#" + jQuery(this).attr("questionId"));
    });
    ids = ids.filter(entry => entry !== "#QID13");
    
var array = [];


function rowExtractor(value, sliceVal){
    value = value.slice(sliceVal)
    if(value[1] == '~') return parseInt(value[0])
    else return parseInt(value.slice(0,2))
};

function sheetGenerator(){
    array.length = 0;
    console.log('starting sheet generator');
    ids.map(id => {
        if(id == '#QID4'){        
            //elaborate slice values
            var truncated = id.slice(1);
            var sliceVal = 4 + truncated.length;
            //temp array to concatenate
            var temp = [];
            temp[0] = [];
            temp[0][0] = '-'
            //table heads
            var heads = jQuery(id + " table th");
            heads.map((index, entry) => {
                if(index < 5){
                    temp[0].push(entry.innerText);
                } else {
                    temp[index - 4] = new Array();
                    temp[index - 4].push(entry.innerText);
                }
            });
            //table cells
            var entries = jQuery(id + " input");
            entries.map((index, entry) => {
                var row = rowExtractor(entry.id, sliceVal);
                temp[row].push(jQuery(entry).val())
            });
            //table title
            var title = ['A01. Dimensioni della PA']
            temp.unshift([title]);
            temp.push([]);
            //concat to main array
            array = array.concat(temp);
        }else{
            var title = [jQuery( id + " h3").text()] ; 
            var choise = [jQuery(id + " .q-checked").text()]; 
            if(choise[0] == "")choise[0] = 'nessuna scelta'; 
            var temp = [title, choise, []];
            array = array.concat(temp);
        }
    })
    return array = array.filter(entry => {if(entry !== undefined)return entry});
};

function downloadExcel(){
    console.log('download called with click')
    var sheet = sheetGenerator();
    var sezione = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(sezione, XLSX.utils.aoa_to_sheet(sheet), 'Sezione A ');
    XLSX.writeFile(sezione, 'Sezione A.xlsx');
}

function localStoring(){
    console.log('local storing called with click');
    var sheet = sheetGenerator();
    localStorage.setItem('sezionea', JSON.stringify(sheet));
    jQuery("#NextButton").trigger('click');
}

jQuery("#excelButton").on('click', downloadExcel);
jQuery('#fakeNext').on('click', localStoring);
```

## SEZIONE B

### B01 Codice completo

Codice completo per la domanda B01 da inserire nell'onReady, adattabile ad altre simili cambiando il **QID** dove è menzionato.
Disabilita in automatico le prime 4 colonne e le righe dei totali, pertanto non è più necessario disabilitarli nell'onLoad.
Il trasferimento dei dati in un'altra domanda è stato eliminato, verrà implementata la copia di dati dalla domanda di destinazione.
```javascript
	
	/* FUNZIONI CONDIVISE */
	function columnExtractor(value){
        value = parseInt(value.slice(value.length - 6).slice(0, 5));
        return value
  		 };
	function rowExtractor(value){
		value = value.replaceAll("QR~QID15~", ''); //SOSTIRUIRE QID15
		value = value.replaceAll('~TEXT', '')
		if(value[1]=='~')return parseInt(value[0]);
		else return parseInt(value[0]+value[1]);
	};
	function selectorFormatter(value){
        value = value.replaceAll("~", "\\~");
		value = "#" + value;
        return value
    };	
	
    /*VARIABILI PRINCIPALI*/
    var inputs = jQuery("#QID15 input"); //SOSTIRUIRE QID15
    var columnSelectors = [];
    var table = jQuery("#QID15 table tr"); //SOSTIRUIRE QID15
    var inputColumns = jQuery(table[0]).children().length -1;
    var totalsPosition = jQuery(jQuery("#QID15 table tbody")[0]). children().length -1; //SOSTIRUIRE QID15
    var lastRow = totalsPosition + 1 ;   
    
    /*PARSING SELETTORI*/
    inputs.map((index,entry) => {
        var currentColumn = columnExtractor(entry.id);
        if(columnSelectors[currentColumn] == undefined) columnSelectors[currentColumn] = new Array();
        columnSelectors[currentColumn].push(selectorFormatter(entry.id))
    });
	/*SOMMA */
    function sumValues(e){
        var currentColumn = columnExtractor(e.target.id);
        var tempValues = [];
        columnSelectors[currentColumn].map((entry, index) => {
			 if(index < totalsPosition - 1) tempValues.push(jQuery(entry).val().replaceAll('.', ''));
        });
        tempValues = tempValues.map(Number);
        var total = tempValues.reduce((a,b) => { return a+b},0);
        var destination = columnSelectors[currentColumn][totalsPosition - 1];
        jQuery(destination).val(total).trigger('change')
    };

	/* EVENT BINDINGS */
	inputs.each(function(){
		var currentRow = rowExtractor(this.id);
		var currentColumn = columnExtractor(this.id);
		
		if(currentColumn <= 4){
            jQuery(this).attr('readonly', true);
        };
		
		if(currentRow == totalsPosition){
			jQuery(this).attr('readonly', true);
		};

		if(currentRow < totalsPosition && currentColumn > 4) {
			jQuery(this).on('keypress', function(evt){
				if(evt.which < 48 || evt.which > 57){
					evt.preventDefault();
					return false;
				};
			});
            //FORMATTA CELLE
			jQuery(this).on("change",function(evt){
       			 jQuery(this).val(function(index, value) {
            	return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        	});
   		 });
			jQuery(this).on('change', sumValues);
		} else if(currentRow == totalsPosition +1 && currentColumn > 4) {
			jQuery(this).on('keypress', function(evt){
                if(evt.which < 48 || evt.which > 57){
                    evt.preventDefault();
                    return false;
                };
            });
            jQuery(this).on("keyup", function(evt){
                if(parseInt(jQuery(this).val()) > 100){
                    jQuery(this).val(100);
                };
            }).trigger('change');
        //FORMATTA TOTALI
		} else if(currentRow == totalsPosition){
			jQuery(this).on("change",function(evt){
                jQuery(this).val(function(index, value) {
            return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
       			 });
    		});
		};		
	});

	var tHead = jQuery("#QID15 thead"); //SOSTITUIRE QID15
    var newHeader ="<tr><td></td><th colspan='4' style='background-color:#F0F6FC'>Rilevazione 2020</th><th colspan='4' style='background-color:#D0E2F5'>Rilevazione 2021</th></tr>" 
    tHead.prepend(newHeader)
		
```

### BTOT01 codice completo

```javascript

    function columnExtractor(value){
        value = parseInt(value.slice(value.length - 6).slice(0, 5));
        return value
    };
    
    var inputs = jQuery("#QID17 input");
    
    var firstQuestion = jQuery("#QID15 input");
    var firstQuestionTotals = firstQuestion.slice(-16).slice(4, 8);
    var firstQuestionPercs = firstQuestion.slice(-4);
    
    var secondQuestion = jQuery("#QID184 input");
    var secondQuestionTotals = secondQuestion.slice(-16).slice(4, 8)
    var secondQuestionPercs = secondQuestion.slice(-4);
    
    var firstRow = inputs.map((index, entry) => {if(index>3 && index <8) return entry} );
    var secondRow = inputs.map((index, entry) => {if(index>11 && index <16) return entry} );
    var thirdRow = inputs.map((index, entry) => {if(index>19 && index < 24) return entry} );
    var fourthRow = inputs.map((index, entry) => {if(index>27 && index < 32) return entry} );
    var fifthRow = inputs.map((index, entry) => {if(index>35 && index < 40) return entry} );
    var sixthRow = inputs.map((index, entry) => {if(index > 43 && index <48) return entry} );
    inputs.each(function(){
        jQuery(this).attr("readonly", true)
    });
        
    function elaborateSixth(one, two, three, four, five, column){
        var total = 0;
        var first = parseInt(one) * parseInt(two) + parseInt(three) * parseInt(four);
        var second = first / parseInt(five);
        if(isNaN(second) || !isFinite(second))  total = 0;
        else total = Math.round(second);
        jQuery(sixthRow[column]).val(total).trigger('change');
    }
    /* RIGHE 1 a 4 */
    function dataTransfer(e){
        console.log('called from ', e.target.id)
        var column = columnExtractor(e.target.id);
        var originIndex = column -5;
        var one = jQuery(firstQuestionTotals[originIndex]).val().replaceAll('.', '');
        var two = jQuery(firstQuestionPercs[originIndex]).val();
        var three = jQuery(secondQuestionTotals[originIndex]).val().replaceAll('.', '');;
        var four = jQuery(secondQuestionPercs[originIndex]).val();
        jQuery(firstRow[originIndex]).val(one).trigger('change'); 
        jQuery(secondRow[originIndex]).val(two).trigger('change');
        jQuery(thirdRow[originIndex]).val(three).trigger('change');
        jQuery(fourthRow[originIndex]).val(four).trigger('change');
        var sum = parseInt(one) + parseInt(three);
        jQuery(fifthRow[originIndex]).val(sum).trigger('change');
        elaborateSixth(one, two, three, four, sum, originIndex);
    }
    
    //event binding
    for(let i = 0; i < firstQuestionTotals.length; i++){
        jQuery(firstQuestionTotals[i]).on('change', dataTransfer);
        jQuery(firstQuestionPercs[i]).on('change', dataTransfer);
        jQuery(secondQuestionTotals[i]).on('change', dataTransfer);
        jQuery(secondQuestionPercs[i]).on('change', dataTransfer);
    };
    
    //binding format
    
    inputs.each(function(){	
        jQuery(this).on("change",function(evt){
                    jQuery(this).val(function(index, value) {
                return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            });
        });
    })
    
    //HEADER
    var tHead = jQuery("#QID17 thead"); 
    var newHeader ="<tr><td></td><th colspan='4' style='background-color:#F0F6FC'>Rilevazione 2020</th><th colspan='4' style='background-color:#D0E2F5'>Rilevazione 2021</th></tr>" 
    tHead.prepend(newHeader)

```

### SEZIONE B Riepilogo dati in Excel
**N.B.** Affinché la funzionalità sia implementata correttamente il codice del riepilogo dati va inserito nello slot del titolo delle domande, dividendo la prima parte nell'onLoad e la seconda nell'onReady.
Lo script funziona solo se tutte in tutte le domande a tabella sono stati inseriti gli header grafici.

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

var excelButton = "<div style='text-align: center; display: center'><input id='excelButton' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='SALVA IN EXCEL' type='button' align='center'></input></div>";
var fakeNext = "<input id='fakeNext' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='AVANTI' type='button' align='center'></input>"

jQuery("#Footer").prepend(excelButton);
jQuery('#Buttons').prepend(fakeNext);


var ids = [];
    jQuery('div[questionId]').each(function(a,b,c){
        ids.push("#" + jQuery(this).attr("questionId"));
    });
    ids = ids.filter(entry => entry !== "#QID8");
    
var array = [];

function rowExtractor(value, sliceVal){
    value = value.slice(sliceVal)
    if(value[1] == '~') return parseInt(value[0])
    else return parseInt(value.slice(0,2))
};
	
	function sheetGenerator(){
		array.length = 0;
		console.log('starting sheet generator');
		ids.map(id => {
            if(id !== "#QID187"){
				//elaborate slice values
				var truncated = id.slice(1);
				var sliceVal = 4 + truncated.length;

				//temp array to concatenate
				var temp = [];
				temp[0] = [];
				temp[0][0] = '-'
				//table heads
				var heads = jQuery(id + " table th").slice(2);
				heads.map((index, entry) => {
					if(index < 8){
						temp[0].push(entry.innerText);
					} else {
						temp[index - 7] = new Array();
						temp[index - 7].push(entry.innerText);
					}
				});
				//table cells
				var entries = jQuery(id + " input");
				entries.map((index, entry) => {
					var row = rowExtractor(entry.id, sliceVal);
					temp[row].push(jQuery(entry).val())
				});
				//table title
				var title = jQuery(id + " label")[0].textContent;
				temp.unshift([title]);
				temp.push([]);
				//concat to main array
				array = array.concat(temp);
		}else{
		
			//temp array to concatenate
				var temp = [];
				temp[0] = [];
				temp[0][0] = '-'
				//table heads
				var heads = jQuery("#QID187 table th").slice(1);
				heads.map((index, entry) => {
					if(index < 4){
						temp[0].push(entry.innerText);
					} else {
						temp[index - 3] = new Array();
						temp[index - 3].push(entry.innerText);
					}
				});
				//table cells
				var entries = jQuery("#QID187 input");
				entries.map((index, entry) => {
					if(index < 4)temp[1].push(jQuery(entry).val())
                    else temp[2].push(jQuery(entry).val())
				});
				//table title
				var title = "B11. Totale Spesa per Innovazione";
				temp.unshift([title]);
				temp.push([]);
				//concat to main array
				array = array.concat(temp);
        }
    })
		return array = array.filter(entry => {if(entry !== undefined)return entry});

	};

	function downloadExcel(){
    console.log('download called with click')
    var sheet = sheetGenerator();
    var sezione = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(sezione, XLSX.utils.aoa_to_sheet(sheet), 'Sezione B ');
    XLSX.writeFile(sezione, 'Sezione B.xlsx');
}

function localStoring(){
    console.log('local storing called with click');
    var sheet = sheetGenerator();
    localStorage.setItem('sezioneb', JSON.stringify(sheet));
    jQuery("#NextButton").trigger('click');
}

jQuery("#excelButton").on('click', downloadExcel);
jQuery('#fakeNext').on('click', localStoring);



```
### SEZIONE B SANITÀ Riepilogo dati in excel
**N.B.** Affinché la funzionalità sia implementata correttamente il codice del riepilogo dati va inserito nello slot del titolo delle domande, dividendo la prima parte nell'onLoad e la seconda nell'onReady.
Lo script funziona solo se tutte in tutte le domande a tabella sono stati inseriti gli header grafici.

In onLoad
```javascript
var body = jQuery("#SurveyEngineBody");
body.prepend('<script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>');
```
In onReady
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

var excelButton = "<div style='text-align: center; display: center'><input id='excelButton' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='SALVA IN EXCEL' type='button' align='center'></input></div>";
var fakeNext = "<input id='fakeNext' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='AVANTI' type='button' align='center'></input>"

jQuery("#Footer").prepend(excelButton);
jQuery('#Buttons').prepend(fakeNext);


var ids = [];
    jQuery('div[questionId]').each(function(a,b,c){
        ids.push("#" + jQuery(this).attr("questionId"));
    });
    ids = ids.filter(entry => entry !== "#QID189");
    var specialIds = ["#QID128", "#QID226", "#QID227", "#QID231", "#QID127", "#QID230", "#QID228"];

var array = [];

function rowExtractor(value, sliceVal){
    value = value.slice(sliceVal)
    if(value[1] == '~') return parseInt(value[0])
    else return parseInt(value.slice(0,2))
};

function sheetGenerator(){
    array.length = 0;
    console.log('starting sheet generator');
    ids.map(id => {
        if(!specialIds.includes(id)){
            //elaborate slice values
            var truncated = id.slice(1);
            var sliceVal = 4 + truncated.length;

            //temp array to concatenate
            var temp = [];
            temp[0] = [];
            temp[0][0] = '-'
            //table heads
            var heads = jQuery(id + " table th").slice(2);
            heads.map((index, entry) => {
                if(index < 8){
                    if(entry.innerText) temp[0].push(entry.innerText);
                    else temp[0].push('-');
                } else {
                    temp[index - 7] = new Array();
                    temp[index - 7].push(entry.innerText);
                }
            });
            //table cells
            var entries = jQuery(id + " input");
            entries.map((index, entry) => {
                var row = rowExtractor(entry.id, sliceVal);
                temp[row].push(jQuery(entry).val())
            });
            //table title
            var title = [jQuery(id + " label")[0].textContent]
            temp.unshift([title]);
            temp.push([]);
            //concat to main array
            array = array.concat(temp);
            //special questions
        } else if (id == '#QID228') {
            var title = [jQuery("#QID228 h3").text()];
            var first = ['N. prenotazioni via CUP online : ', jQuery("#QID228 input")[0].value];
            var second = ['N. prenotazioni complessive : ', jQuery("#QID228 input")[1].value];
            array.push(title, first, second, [])
        } else if (id == '#QID230') {
            var title = [jQuery("#QID230 h3").text()];
            var first = ['N. referti digitali : ', jQuery("#QID230 input")[0].value];
            var second = ['N. referti NON digitali : ', jQuery("#QID230 input")[1].value];
            array.push(title, first,second, [])
        } else if (id == '#QID231' || id == '#QID127') {
            var title = [jQuery(id + " h3").text()];
            var text = [jQuery(id + " input").val()];
            array.push(title, text, second, [])
        } else if (id == '#QID227') {
            var title = [jQuery("#QID227 h3").text()];
            var choise = [jQuery("#QID227 .q-checked").text()];
            array.push(title, choise, [])
        } else if (id == '#QID128' || id == '#QID226') {
            var labels = [];
            var checkStatus = [];
            var wholeQuestion = [];
            var questionLabels = jQuery(id + " label span");
            var questionAnswers = jQuery(id + " .MultipleAnswer");
            var title = [jQuery(id + " h3").text()]
            questionLabels.each(function () {
                labels.push(this.innerText)
            });
            questionAnswers.each(function () {
                if (this.className.includes('q-checked')) checkStatus.push('Si')
                else checkStatus.push('No')
            });
            array.push(title);
            for (let i = 0; i < labels.length; i++) {
                if (wholeQuestion[i] == undefined) wholeQuestion[i] = [];
                array.push([labels[i], checkStatus[i]])
            };
        }
    })

    return array = array.filter(entry => {if(entry !== undefined)return entry});
}

function downloadExcel(){
    console.log('download called with click')
    var sheet = sheetGenerator();
    var sezione = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(sezione, XLSX.utils.aoa_to_sheet(sheet), 'Sezione B Sanità');
    XLSX.writeFile(sezione, 'Sezione B II .xlsx');
}

function localStoring(){
    console.log('local storing called with click');
    var sheet = sheetGenerator();
    localStorage.setItem('sezionebsanita', JSON.stringify(sheet));
    jQuery("#NextButton").trigger('click');
}

jQuery("#excelButton").on('click', downloadExcel);
jQuery('#fakeNext').on('click', localStoring);
```
### Btot 06 tutte le formule

Codice completo per la domanda Btot06 "Totale spesa per canale d'acquisto". Commenti come "tot b01" fanno riferimento alla domanda su qualtrics e non al file excel salvo diversamente specificato.
Il codice disabilita in automatico tutti gli input, pertanto eventuali 'readonly' specificati nell'onLoad vanno cancellati.

```javascript

// funzioni condivise da non modificare, qualora si dovesse riutilizzare in un'altra domanda il codice per elaborare una singola riga è necessario copiare le funzioni che vi vengono menzionate
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
function valueFormatter(value){
    value = value.toString();
    value = value.replace(/\D/g, "");
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return value
};
	/* RIGA 01 */
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
		jQuery("#" + firstDestinations[firstColumn]).val(valueFormatter(firstTotal)).trigger('change'); 
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
	var secondColumns = [
    'QR~QID15~8~1~TEXT', //tot b01
    'QR~QID18~5~1~TEXT', //tot b03
    'QR~QID21~3~1~TEXT', //tot b05 
    'QR~QID24~3~1~TEXT', //tot b07
    'QR~QID27~10~1~TEXT' //tot b09
	];
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
		jQuery("#" + secondDestSelectors[column]).val(Math.round(total)).trigger('change');
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
		jQuery("#" + thirdDestinations[thirdColumn]).val(valueFormatter(thirdTotal)).trigger('change'); 
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
        jQuery("#" + fourthDestSelectors[column]).val(Math.round(total)).trigger('change');
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
	var inputs = jQuery("#QID30 input");
	var fifthColumns = [];

    function fifthRow(e){
        var column = columnExtractor(e.target.id);
        var one = jQuery(fifthColumns[column][0]).val();
        var two = jQuery(fifthColumns[column][2]).val();
        var total = valueParser(one) + valueParser(two);
		
        jQuery(fifthColumns[column][4]).val(valueFormatter(total)).trigger('change');
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
        jQuery(sixthColumns[column][5]).val(Math.round(total)).trigger('change'); 
    };

    for(let i = 0; i < 48; i++){
        var test = i%8 +1;
        if (sixthColumns[test] == undefined) sixthColumns[test] = new Array();
        sixthColumns[test].push(inputs[i]);
        if(i < 40 && !skipped.includes(i%8)) jQuery(inputs[i]).on('change', sixthRow);
    };
    //disabilita tutti gli input
    inputs.each(function(){
		jQuery(this).attr('readonly', true);
	})

    /* HEADER GRAFICO */
    var tHead = jQuery("#QID30 thead");
    var newHeader ="<tr><td></td><th colspan='4' style='background-color:#F0F6FC'>Rilevazione 2020</th><th colspan='4' style='background-color:#D0E2F5'>Rilevazione 2021</th></tr>" 
    tHead.prepend(newHeader)
```
### Btot07 tutte le formule ( TEMPLATE )

Le formule che seguono nel template sono le stesse della Btot06 riadattate alle esigenze della Btot07, nei commenti sono indicate le celle del file excel di riferimento e bisogna riportarvi gli id delle celle corrispondenti seguendo le inicazioni nei commenti. Diciture come "b21" nei commenti, salvo diversamente specificato, fanno sempre riferimento al file excel "Requisiti Sez B e B sanità" del 22/04.

```javascript
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
function valueFormatter(value){
    value = value.toString();
    value = value.replace(/\D/g, "");
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return value
};

	/* RIGA 01 */
    // formula excel di riferimento B39+B71
	var firstColumns = [
		'', //id dell'input corrispondente alla b39 di excel
		'', //id dell'input corrispondente alla b71 di excel
	];
	var firstDestination = ""; // id prima cella prima colonna prima riga btot07
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
		jQuery("#" + firstDestinations[firstColumn]).val(valueFormatter(firstTotal)).trigger('change'); 
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
    //formula excel di riferimento IFERROR((B15*B16+B29*B30+B50*B51+B61*B62)/B185,0)
    var secondColumns = [
        '', //cella b15
        '', //cella b29
        '', //cella b50
        '' //cella b61
    ];
    var secondMultipliers = [
        '', //cella b16
        '', //cella b30
        '', //cella b51
        '', //cella b62
    ];

    var secondDivider = ''; //prima colonna prima cella prima riga btot07 (b185)
    var secondDestination = ""; //prima cella prima colonna seconda riga btot07
    var secondSelectors = [];
    var secondDestSelectors = [];
    var secondMultiSelectors = [];
    var secondDivSelectors = [];
    var secondValues = [];

    function secondRow(e){
        console.log('second called')
        var column = columnExtractor(e.target.id);
        secondValues.length = 0;
        for(let i = 0; i < 4; i++){
            var one =  jQuery("#" + secondSelectors[column][i]).val();
            var two = jQuery("#" + secondMultiSelectors[column][i]).val();
            var product = valueParser(one) * valueParser(two);
            secondValues.push(product)
        };
        var sum = secondValues.reduce((a,b) => {return a+b}, 0);
        var divisionUnit = valueParser(jQuery("#" + secondDivSelectors[column]).val());
        var partial = sum / divisionUnit;
        var total = infinityChecker(partial);
        jQuery("#" + secondDestSelectors[column]).val(Math.round(total)).trigger('change');
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
    // formula excel di riferimento B99+B127+B169
	var thirdColumns = [
    '', // b99
    '', // b127
    '' // b169
	];
	var thirdDestination = ""; // id prima cella prima colonna terza riga btot07
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
		jQuery("#" + thirdDestinations[thirdColumn]).val(valueFormatter(thirdTotal)).trigger('change'); 
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
    // FORMULA DI RIFERIMENTO EXCEL B80*B81+B89*B90+B108*B109+B117*B118+B143*B144+B159*B160)/B187,0
    var fourthColumns = [
        '', // b80
        '', //b89
        '', //b108
        '', //b117
        '', //b143
        '' //b159
    ];
    var fourthMultipliers = [
        '', //b81
        '', //b90
        '', //b109
        '', //b118
        '', //b144
        '' //b160
    ];

    var fourthDivider = ''; // b187
    var fourthDestination = ""; //prima cella prima colonna riga 4 btot07
    var fourthSelectors = [];
    var fourthDestSelectors = [];
    var fourthMultiSelectors = [];
    var fourthDivSelectors = [];
    var fourthValues = [];

    function fourthRow(e){
        console.log('fourth called')
        var column = columnExtractor(e.target.id);
        fourthValues.length = 0;
        for(let i = 0; i < 6; i++){
            var one =  jQuery("#" + fourthSelectors[column][i]).val();
            var two = jQuery("#" + fourthMultiSelectors[column][i]).val();
            var product = valueParser(one) * valueParser(two);
            fourthValues.push(product)
        };
        var sum = fourthValues.reduce((a,b) => {return a+b}, 0);
        var divisionUnit = valueParser(jQuery("#" + fourthDivSelectors[column]).val());
        var partial = sum / divisionUnit;
        var total = infinityChecker(partial);
        jQuery("#" + fourthDestSelectors[column]).val(Math.round(total)).trigger('change');
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
    // formula excel di riferimento B185+B187
    var inputs = jQuery("#QID31 input");
    var fifthColumns = [];

    function fifthRow(e){
        var column = columnExtractor(e.target.id);
        var one = jQuery(fifthColumns[column][0]).val();
        var two = jQuery(fifthColumns[column][2]).val();
        var total = valueParser(one) + valueParser(two);
        jQuery(fifthColumns[column][4]).val(valueFormatter(total)).trigger('change');
    };
​
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
    // formula excel di riferimento IFERROR((B185*B186+B187*B188)/B189,0)
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
        total = Math.round(total);
        jQuery(sixthColumns[column][5]).val(Math.round(total)).trigger('change'); 
    };

    for(let i = 0; i < 48; i++){
        var test = i%8 +1;
        if (sixthColumns[test] == undefined) sixthColumns[test] = new Array();
        sixthColumns[test].push(inputs[i]);
        if(i < 40 && !skipped.includes(i%8)) jQuery(inputs[i]).on('change', sixthRow);
    };
    //disabilita input
    inputs.each(function(){
		jQuery(this).attr('readonly', true);
	})

    /* HEADER GRAFICO */
    var tHead = jQuery("#QID31 thead");
    var newHeader ="<tr><td></td><th colspan='4' style='background-color:#F0F6FC'>Rilevazione 2020</th><th colspan='4' style='background-color:#D0E2F5'>Rilevazione 2021</th></tr>" 
    tHead.prepend(newHeader)

```
### B11 Formula Completa
Rimuovere la parte di codice nell'onLoad, disabilita da sola le celle della prima riga.
```javascript
     var firstRow = jQuery("#QID187 input").slice(0, 4);
    var secondRow = jQuery("#QID187 input").slice(-4);
    var origins = jQuery("#QID31 input").slice(-12).slice(0,4);
    var message = 'ATTENZIONE : il valore della seconda riga non può essere maggiore del valore della prima';

	function valueFormatter(value){
		value = value.toString();
		value = value.replace(/\D/g, "");
		value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		return value
	};
    function columnExtractor(value){
        value = parseInt(value.slice(value.length - 6).slice(0, 5));
        return value
  	};
    function errorCheck () {
		firstRow.map((index,entry) => {
            var value = jQuery(entry).val().replaceAll('.', '');
            var secondValue = jQuery(secondRow[index]).val().replaceAll('.','');
            if(parseInt(secondValue) > parseInt(value)){
				window.alert(message);
				jQuery(secondRow[index]).val('')
			 }else{
				var newValue = jQuery(secondRow[index]).val().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
				jQuery(secondRow[index]).val(newValue);
			}
        });
    };
    function transferValue(e){
        var column = columnExtractor(e.target.id);
        var value = jQuery(this).val();
        jQuery(firstRow[column - 5]).val(valueFormatter(value));
    };
    firstRow.each(function(evt){
        jQuery(this).attr('readonly', true);
    });

    secondRow.each(function(evt){
        jQuery(this).on('keypress', function(evt){
            if(evt.which < 48 || evt.which > 57){
                evt.preventDefault();
                return false;
            };
        });
        jQuery(this).on('change', errorCheck);
    });
    origins.each(function(e){
        jQuery(this).on('change', transferValue)
    })

    var tHead = jQuery("#QID187 > div.Inner.BorderColor.TE > div > fieldset > div > table > thead");
    var newHeader ="<tr><td></td><th colspan='4' style='background-color:#F0F6FC'>Rilevazione 2021</th>" 

    tHead.prepend(newHeader)
        
	
	
```
## Sezione D ##
### D02A, D02B - Impostare convalida data nella forma mm/aaaa
Inserire nella relativa domanda
```javascript
jQuery("#QR\\~1_QID136").attr("type", "month")

jQuery("#QR\\~1_QID137").attr("type", "month")
```

## **Tutte le domande**


### Nascondere dall'indice le ultime due voci
Da inserire nella testa di ogni sezione (A, B, C etc) nell'onLoad, rimuove "Nota di accompagnamento" e "Conferma invio" dall'indice a tendina.

```javascript
var sideBar = jQuery("#Toc ul li");
    sideBar.map((index, entry) => {
        if(index == sideBar.length -1 || index == sideBar.length -2){
            jQuery(entry).hide()
        }
    })
```
Da inserire nella testa della prima sezione 'Piano Triennale per l'Informatica nella Pubblica Amministrazione etc' nell'onLoad per nascondere gli ultimi due link nell'indice generale. Va inserito inoltre nell' addOnUnload della testa della Sezione A per impedire ai link di comparire se l'utente dovesse premere il bottone indietro 
```javascript
var observer = new MutationObserver(function() {
    const toc = document.querySelector("#TOCPage");
        if(toc) {
            var links = jQuery("#TOCPage li")

		links.map((index, entry) => {
			if(index == links.length -1 || index == links.length -2){
				jQuery(entry).hide()
			}
    })
        };
    });
    observer.observe(document.querySelector("#Page"), {
        childList: true,
        subtree: true
    });
```

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
​
