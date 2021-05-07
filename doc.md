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

## Benvenuto - Intercettare download del template

La domanda viene nascosta dalla vista dell'utente, tuttavia il click sul link risponde sì alla domanda. 
Non è tecnicamente possibile verificare se poi l'utente abbia effettivamente scaricato il template o se al momento del salvataggio abbia cancellato il download.

Nell'onReady della domanda da nascondere
```javascript
jQuery("#QID402").hide();

```
I seguenti snippet vanno nell'onReady di ciascuna domanda: 

Domanda per **Regione**
```javascript
var link = jQuery("#QID405 a")[2]
function answer(e){
    jQuery("#QR\\~QID402\\~1").trigger('click');
}
link.on('click', answer);

```

Domanda per **Città Metropolitana**
```javascript
var link = jQuery("#QID403 a")[2]
function answer(e){
    jQuery("#QR\\~QID402\\~1").trigger('click');
}
link.on('click', answer);
```

Domanda per **Comune**
```javascript
var link = jQuery("#QID404 a")[2]
function answer(e){
    jQuery("#QR\\~QID402\\~1").trigger('click');
}
link.on('click', answer);
```

Domanda per **PAC**
```javascript
var link = jQuery("#QID2 a")[2]
function answer(e){
    jQuery("#QR\\~QID402\\~1").trigger('click');
}
link.on('click', answer);
```

## SEZIONE A - Riepilogo Dati in excel - WORK IN PROGRESS

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
            var temp = [['A01. Dimensioni della PA']];
            temp[1] = ['-'];
            var heads = jQuery("#QID4 th");
            heads = heads.slice(1);
            heads.map((index, entry) => {
               if(index <4){
                    temp[1].push(entry.innerText) 
               } else {
                   var newIndex = index-2;
                   temp[newIndex] = new Array();
                   temp[newIndex].push(entry.innerText);
               };
            });
            var inputs = jQuery("#QID4 input");
            inputs.map((index, value) => {
                if(index%5 !== 0){
                    var rowIndex = Math.floor(index/5) +2;
                    if(temp[rowIndex] == undefined) temp[rowIndex] = new Array();
                    temp[rowIndex].push(jQuery(value).val());
                };
            });
            temp.push([]);
            array = array.concat(temp);
        }else{
            var title = [jQuery( id + " h3").text()] ; 
            var choise = [jQuery(id + " .q-checked").text()]; 
            if(choise[0] == "")choise[0] = 'nessuna scelta'; 
            var temp = [title, choise, []];
            array = array.concat(temp);
        }
    })
    array = array.filter(entry => {if(entry !== undefined)return entry});
	if(array[13][0] !== "Si" ){ array = array.slice(0,15)};
	return array
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
                var title = jQuery(id + " label")[0].textContent;
                var temp = [[title], ['-']];

				var heads = jQuery(id + " table th").slice(6);
				heads.map((index, entry) => {
					if(index < 4){
						temp[1].push(entry.innerText);
					} else {
                        var newIndex = index -2;
						temp[newIndex] = new Array();
						temp[newIndex].push(entry.innerText);
					}
				});
                var skipper = [0,1,2,3]
				var entries = jQuery(id + " input");
                var filtered = entries.map((index, element) => {
                    if(!skipper.includes(index % 8)) {
                        return element
                    }
                });
                var rowIndex = 2;
                while(filtered.length !== 0){
                    var pusher = filtered.slice(0, 4);
                    pusher.each((index,entry) => temp[rowIndex].push(jQuery(entry).val()) );
                    filtered = filtered.slice(4);
                    rowIndex ++;
                }
				temp.push([]);
				array = array.concat(temp);
		}else{
		
				var temp = [];
				temp[0] = [];
				temp[0][0] = '-'
				var heads = jQuery("#QID187 table th").slice(1);
				heads.map((index, entry) => {
					if(index < 4){
						temp[0].push(entry.innerText);
					} else {
						temp[index - 3] = new Array();
						temp[index - 3].push(entry.innerText);
					}
				});
				var entries = jQuery("#QID187 input");
				entries.map((index, entry) => {
					if(index < 4)temp[1].push(jQuery(entry).val())
                    else temp[2].push(jQuery(entry).val())
				});
				var title = "B11. Totale Spesa per Innovazione";
				temp.unshift([title]);
				temp.push([]);
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
        var test = jQuery(id);
        if(test[0] !== undefined && !(test[0].hasClassName('hidden'))){
            if(!specialIds.includes(id)){
                var title = jQuery(id + " label")[0].textContent;
                var temp = [[title], ['-']];

				var heads = jQuery(id + " table th").slice(6);
				heads.map((index, entry) => {
					if(index < 4){
						temp[1].push(entry.innerText);
					} else {
                        var newIndex = index -2;
						temp[newIndex] = new Array();
						temp[newIndex].push(entry.innerText);
					}
				});
                var skipper = [0,1,2,3]
				var entries = jQuery(id + " input");
                var filtered = entries.map((index, element) => {
                    if(!skipper.includes(index % 8)) {
                        return element
                    }
                });
                var rowIndex = 2;
                while(filtered.length !== 0){
                    var pusher = filtered.slice(0, 4);
                    pusher.each((index,entry) => temp[rowIndex].push(jQuery(entry).val()) );
                    filtered = filtered.slice(4);
                    rowIndex ++;
                }
				temp.push([]);
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
                    if (this.className.includes('q-checked')) checkStatus.push('X')
                    else checkStatus.push(' ')
                });
                array.push(title);
                for (let i = 0; i < labels.length; i++) {
                    if (wholeQuestion[i] == undefined) wholeQuestion[i] = [];
                    array.push([labels[i], checkStatus[i]])
                };
            }
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

## SEZIONE C

### Riepilogo dati in Excel sezione C I
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
var fakeNext = "<input id='fakeNext' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='AVANTI' type='button' align='center'></input>";
jQuery("#Footer").prepend(excelButton);
jQuery('#Buttons').prepend(fakeNext);

var discard = ["#QID33", "#QID34", "#QID35"]; //titles, unused
var typeA = ["#QID36", "#QID47"];
var typeB = ["#QID43", "#QID63", "#QID62", "#QID54", "#QID56"];
var typeC = ["#QID37", "#QID41", "#QID48", "#QID52"];
var typeD = ["#QID58", "#QID60", "#QID61", "#QID59"];
var typeE = ["#QID216", "#QID222"];
var typeF = ["#QID217", "#QID223", "#QID221", "#QID156"];
var typeG = ["#QID44", "#QID55", "#QID218", "#QID224", "#QID220", "#QID225"]; 

var ids = [];
    jQuery('div[questionId]').each(function(a,b,c){
        ids.push("#" + jQuery(this).attr("questionId"));
    });
    ids = ids.filter(entry => !discard.includes(entry));
    
var array = [];

function sheetGenerator(){
    console.log('starting sheetGenerator')
    array.length = 0;
    ids.map((id, index) => {
        var test = jQuery(id);
        if(test[0] !== undefined && !(test[0].hasClassName('hidden'))) {
            if(typeA.includes(id)){
                var columns = 3;
                var rows = 7
                var title = jQuery(id + " h3")[0].innerText;
                var checkboxes = jQuery(id + " input");
                var boxesValues = [];
                checkboxes.map((index, entry) => {
                    if(entry.checked) boxesValues[index] = 'X';
                    else boxesValues[index] = '';
                });

                var trs = jQuery(id + " tr th");
                var labels = [];
                var headers = ['-'];
                var heads = trs.slice(0, columns);
                trs = trs.slice(columns)
                trs.map((index, entry) => {
                    labels[index] = entry.innerText;
                })
                heads.map((index,entry) => {
                    headers.push(entry.innerText)
                })

                var temp = [headers];
                labels.map((entry, index) => {
                    var test = index +1;
                    if(temp[test] == undefined) temp[test] = new Array();
                    temp[test].push(entry);     
                    temp[test] = temp[test].concat(boxesValues.slice(columns * index, columns * (index+1)))
                });
                temp = temp.concat([]);
                temp.unshift([title]);
                array = array.concat(temp);
            } else if(typeB.includes(id)){
                var title = jQuery(id + " label")[0].textContent;
                title = title.replaceAll("\"" , "'" );
                var input = jQuery(id + " input").val();
                var temp = [[title], [input], []];
                array = array.concat(temp);
            } else if(typeC.includes(id)){
                var labels = jQuery(id + " label");
                var inputs = jQuery(id + " input");
                var title = jQuery(id + " h3")[0].textContent
                var temp = [[title]];
                temp[1] = [inputs[0].textContent]
                labels.map((index, entry) => {
                    if(index>0){
                        var newIndex = index + 1
                        temp[newIndex] = new Array();
                        temp[newIndex].push(entry.textContent, jQuery(inputs[index -1]).val())
                    }
                });
                temp.push([]); 
                array = array.concat(temp);
            }else if(typeD.includes(id)){
                var columns = 2;
                var title = jQuery(id + " h3")[0].textContent;
                var checkboxes = jQuery(id + " input");
                var rows = checkboxes.length / 2;
                var headers = jQuery(id + " th");
                var temp = [];
                temp[0] = [title];
                temp[1] = ['-', headers[0].innerText, headers[1].innerText];
                headers = headers.slice(2);


                for(var i = 0; i < rows; i++){
                    var checkIndex = i * 2; 
                    var first = checkboxes[checkIndex].checked;
                    var second = checkboxes[checkIndex +1].checked;
                    if(first) first = 'X'; else first = ' ';
                    if(second) second = 'X'; else second = ' ' 
                    temp[i +2] = new Array();
                    temp[i+2].push(headers[i].innerText, first, second)
                }
                temp.push([]);
                array = array.concat(temp);
            } else if(typeE.includes(id)){
                var title = jQuery(id + " h3")[0].innerText;
                var answer = jQuery(id + " label")[0].hasClassName('q.checked') ? 'Si' : 'No';
                var temp = [[title], [answer], []];
                array = array.concat(temp);
            } else if(typeF.includes(id)){
                var title = jQuery(id + " h3")[0].innerText;
                var answer = jQuery(id + " input").val();
                var temp = [[title], [answer], []];
                array = array.concat(temp);
            } else if(typeG.includes(id)){
                var title = jQuery(id + " h3")[0].innerText;
                var columns = 7;
                var rows = jQuery(id + " th").length - 7; 
                var temp = [];
                temp[0] = [title];
                temp[1] = ['-'];
                jQuery(id + " th").slice(0, columns).map((index, entry) => {temp[1].push(entry.innerText)});
                var labels = jQuery(id + " th").slice(columns);
                var checkboxes = jQuery(id + " input").map((index, entry) => { if(entry.checked)return 'X'; else return ' '})

                for(let i = 0; i < rows; i++){
                    var checkindex = i * 7;
                    temp[i+2] = new Array();
                    temp[i+2].push(labels[i].innerText)
                    for(let a = checkindex; a < checkindex + 7; a++){
                        temp[i+2].push(checkboxes[a]);
                    }
                }
                temp.push([]);
                array = array.concat(temp);
            }
        }  
    });
    return array
};

function downloadExcel(){
    console.log('download called with click')
    var sheet = sheetGenerator();
    var sezione = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(sezione, XLSX.utils.aoa_to_sheet(sheet), 'Sezione C I');
    XLSX.writeFile(sezione, 'Sezione C I.xlsx');
}

function localStoring(){
    console.log('local storing called with click');
    var sheet = sheetGenerator();
    localStorage.setItem('sezionec_01', JSON.stringify(sheet));
    jQuery("#NextButton").trigger('click');
}

jQuery("#excelButton").on('click', downloadExcel);
jQuery('#fakeNext').on('click', localStoring);
```

### Riepilogo Dati in Excel sezione C II
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
var fakeNext = "<input id='fakeNext' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='AVANTI' type='button' align='center'></input>";
jQuery("#Footer").prepend(excelButton);
jQuery('#Buttons').prepend(fakeNext);

var typeA = ["#QID210", "#QID65", "#QID69", "#QID71", "#QID70", "#QID75"];
var typeB = ["#QID68", "#QID66", "#QID72", "#QID76"];
var typeC = ["#QID211", "#QID67"];

var ids = [];
    jQuery('div[questionId]').each(function(a,b,c){
        ids.push("#" + jQuery(this).attr("questionId"));
    });
    ids = ids.filter(entry => !entry!=="#QID64");
    
var array = [];

function sheetGenerator(){
    console.log('starting sheetGenerator')
    array.length = 0;
    ids.map((id, index) => {

        var test = jQuery(id);

        if(test[0] !== undefined && !(test[0].hasClassName('hidden'))) {
            if(typeA.includes(id)){
                //typeA
                var title = jQuery(id + " h3")[0].textContent;
                var answer = '';
                 if(jQuery(id + " .q-checked").length !== 0) answer = jQuery(id + " .q-checked")[1].textContent;
                var temp = [[title], [answer], []];
                array = array.concat(temp);
            } else if(typeB.includes(id)){
                var title = jQuery(id + " h3")[0].textContent;
                var answer = jQuery(id + " input").val();
                var temp = [[title], [answer], []];
                array = array.concat(temp);
            } else if(typeC.includes(id)){
                var title = jQuery(id + " h3")[0].textContent;
                var checked = jQuery(id + " .MultipleAnswer.q-checked");
                var temp = [[title], []];
                    if(checked.length !== 0){
                        checked.map((i,v) => { 
                        var newIndex = i+1;
                        if(temp[newIndex] == undefined){
                            temp[newIndex] = new Array();
                        }
                        temp[newIndex].push(v.textContent);
                        })
                    }
                temp.push([]);
                array = array.concat(temp);                
            }  
        }})
    
    return array
};

function downloadExcel(){
    console.log('download called with click')
    var sheet = sheetGenerator();
    var sezione = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(sezione, XLSX.utils.aoa_to_sheet(sheet), 'Sezione C II');
    XLSX.writeFile(sezione, 'Sezione C II.xlsx');
}

function localStoring(){
    console.log('local storing called with click');
    var sheet = sheetGenerator();
    localStorage.setItem('sezionec_02', JSON.stringify(sheet));
    jQuery("#NextButton").trigger('click');
}

jQuery("#excelButton").on('click', downloadExcel);
jQuery('#fakeNext').on('click', localStoring);
```

### Riepilogo Dati in Excel sezione C III
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
var fakeNext = "<input id='fakeNext' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='AVANTI' type='button' align='center'></input>";
jQuery("#Footer").prepend(excelButton);
jQuery('#Buttons').prepend(fakeNext);

var typeA = ["#QID81", "#QID212", "#QID88", "#QID89"];
var typeB = ["#QID82", "#QID87"];
var typeC = ["#QID85", "#QID86"]; //83

var ids = [];
    jQuery('div[questionId]').each(function(a,b,c){
        ids.push("#" + jQuery(this).attr("questionId"));
    });
    ids = ids.filter(entry => !entry!=="#QID80");
    
var array = [];

function sheetGenerator(){
    console.log('starting sheetGenerator')
    array.length = 0;
    ids.map((id, index) => {
        var test = jQuery(id);
        if(test[0] !== undefined && !(test[0].hasClassName('hidden'))) {
            if(typeA.includes(id)){
                //typeA
                var title = jQuery(id + " legend")[0].textContent;
                var answer = '';
                 if(jQuery(id + " .q-checked").length !== 0) answer = jQuery(id + " .q-checked")[1].textContent;
                var temp = [[title], [answer], []];
                array = array.concat(temp);
            } else if(typeB.includes(id)){
                var title = jQuery(id + " legend")[0].textContent;
                var answer = jQuery(id + " input").val();
                var temp = [[title], [answer], []];
                array = array.concat(temp);
            } else if(typeC.includes(id)) {
                var heads = jQuery(id + " th");
                var title = jQuery(id + " legend")[0].textContent;
                var temp = [];
                temp[0] = [[title]];
                temp[1] = ['-'];
                heads.map((index, entry) => {
                    if(index < 4){
                    temp[1].push(entry.innerText)
                    } else {
                        temp[index -2] = new Array() ; 
                        temp[index -2].push(entry.innerText)
                    };
                });
                var inputs = jQuery(id + " input");
                inputs.map((index,entry) => {
                    var internalIndex = Math.floor(index / 4) +2;
                    if(temp[internalIndex] == undefined) temp[internalIndex] = new Array();
                    temp[internalIndex].push(jQuery(entry).val());
                })
                temp.push([]);
                array = array.concat(temp);

            } else if(id =="#QID83"){    
                var columns = 3;
                var title = jQuery(id + " legend")[0].innerText;
                var checkboxes = jQuery(id + " input");
                var boxesValues = [];
                checkboxes.map((index, entry) => {
                    if(entry.checked) boxesValues[index] = 'X';
                    else boxesValues[index] = ' ';
                });

                var trs = jQuery(id + " tr th");
                var labels = [];
                var headers = ['-'];
                var heads = trs.slice(0, columns);
                trs = trs.slice(columns)
                trs.map((index, entry) => {
                    labels[index] = entry.innerText;
                })
                heads.map((index,entry) => {
                    headers.push(entry.innerText)
                })

                var temp = [headers];
                labels.map((entry, index) => {
                    var test = index +1;
                    if(temp[test] == undefined) temp[test] = new Array();
                    temp[test].push(entry);     
                    temp[test] = temp[test].concat(boxesValues.slice(columns * index, columns * (index+1)))
                });
                temp.unshift([title]);
                temp.push([]);
                array = array.concat(temp);
            }
        }  
    });
    return array
};

function downloadExcel(){
    console.log('download called with click')
    var sheet = sheetGenerator();
    var sezione = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(sezione, XLSX.utils.aoa_to_sheet(sheet), 'Sezione C III');
    XLSX.writeFile(sezione, 'Sezione C III.xlsx');
}

function localStoring(){
    console.log('local storing called with click');
    var sheet = sheetGenerator();
    localStorage.setItem('sezionec_03', JSON.stringify(sheet));
    jQuery("#NextButton").trigger('click');
}

jQuery("#excelButton").on('click', downloadExcel);
jQuery('#fakeNext').on('click', localStoring);
```

### Riepilogo Dati in Excel Sezione CIV
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
var fakeNext = "<input id='fakeNext' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='AVANTI' type='button' align='center'></input>";
jQuery("#Footer").prepend(excelButton);
jQuery('#Buttons').prepend(fakeNext);

var typeA = ["#QID93", "#QID95", "#QID99", "#QID101"]; 
var typeB = ["#QID96", "#QID97"]; 
var typeC = ["#QID214"]

var ids = [];
    jQuery('div[questionId]').each(function(a,b,c){
        ids.push("#" + jQuery(this).attr("questionId"));
    });
    ids = ids.filter(entry => entry!=="#QID90");
    
var array = [];

function sheetGenerator(){
    console.log('starting sheetGenerator')
    array.length = 0;
    ids.map((id, index) => {
        var test = jQuery(id);
        if(test[0] !== undefined && !(test[0].hasClassName('hidden'))) {
            if(typeA.includes(id)){
                var title = jQuery(id + " h3")[0].textContent;
                var answer = jQuery(id + " input").val();
                var temp = [[title], [answer], []];
                array = array.concat(temp);
            } else if(typeB.includes(id)){
                var columns = 4;
                    if(id == "#QID96") columns = 2;
                    else columns = 4;
                var title = jQuery(id + " h3")[0].innerText;
                var checkboxes = jQuery(id + " input");
                var boxesValues = [];
                checkboxes.map((index, entry) => {
                    if(entry.checked) boxesValues[index] = 'X';
                    else boxesValues[index] = ' ';
                });
                var trs = jQuery(id + " tr th");
                var labels = [];
                var headers = ['-'];
                var heads = trs.slice(0, columns);
                trs = trs.slice(columns)
                trs.map((index, entry) => {
                    labels[index] = entry.innerText;
                })
                heads.map((index,entry) => {
                    headers.push(entry.innerText)
                })
                var temp = [headers];
                labels.map((entry, index) => {
                    var test = index +1;
                    if(temp[test] == undefined) temp[test] = new Array();
                    temp[test].push(entry);     
                    temp[test] = temp[test].concat(boxesValues.slice(columns * index, columns * (index+1)))
                });
                temp.unshift([title]);
                temp.push([]);
                array = array.concat(temp);                
            } else if(id == "#QID104") {
                var heads = jQuery(id + " th");
                var title = jQuery(id + " h3")[0].textContent;
                var temp = [];
                temp[0] = [[title]];
                temp[1] = ['-'];
                heads.map((index, entry) => {
                    if(index < 4){
                    temp[1].push(entry.innerText)
                    } else {
                        temp[index -2] = new Array() ; 
                        temp[index -2].push(entry.innerText)
                    };
                });
                var inputs = jQuery(id + " input");
                inputs.map((index,entry) => {
                    var internalIndex = Math.floor(index / 4) +2;
                    if(temp[internalIndex] == undefined) temp[internalIndex] = new Array();
                    temp[internalIndex].push(jQuery(entry).val());
                })
                temp.push([]);
                array = array.concat(temp);
            } else if(typeC.includes(id)){
                var title = jQuery(id + " h3")[0].textContent;
                var checked = jQuery(id + " .MultipleAnswer.q-checked");
                var temp = [[title], []];
                if(checked.length !== 0){
                    checked.map((i,v) => { 
                    var newIndex = i+1;
                    if(temp[newIndex] == undefined){
                        temp[newIndex] = new Array();
                    }
                    temp[newIndex].push(v.textContent);
                })
                }
                temp.push([]);
                array = array.concat(temp);                
            } else { 
                var title = jQuery(id + " h3")[0].textContent;
                var answer = '';
                 if(jQuery(id + " .q-checked").length !== 0) answer = jQuery(id + " .q-checked")[1].textContent;
                var temp = [[title], [answer], []];
                array = array.concat(temp);
            }
        }  
    })
    return array
};

function downloadExcel(){
    console.log('download called with click')
    var sheet = sheetGenerator();
    var sezione = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(sezione, XLSX.utils.aoa_to_sheet(sheet), 'Sezione C IV');
    XLSX.writeFile(sezione, 'Sezione C IV.xlsx');
}

function localStoring(){
    console.log('local storing called with click');
    var sheet = sheetGenerator();
    localStorage.setItem('sezionec_04', JSON.stringify(sheet));
    jQuery("#NextButton").trigger('click');
}

jQuery("#excelButton").on('click', downloadExcel);
jQuery('#fakeNext').on('click', localStoring);
```

### Totali CC01C
In onReady
```javascript
 var inputs = jQuery("#QID85 input");
    var column = [ ];
    
    function columnExtractor(value){
        value = value.slice(12);
        switch(value[0] + value[1]){
            case('8~'): return 0
            case('9~'): return 1
            case('10'): return 2
            default : return 3
        }    
    };

    function sumValues(e){
        var vals = [];
        var col = columnExtractor(e.target.id);
        vals = column[col].map((entry, index) => {
            if(index < 3){
                return jQuery(entry).val().replaceAll('.', ''); //unformat
            }else {
                return 0
            }
        });
        vals = vals.map(Number)
        var total = vals.reduce((a,b) => {return a +b},0);
        total = total.toString();
        total = total.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        jQuery(column[col][3]).val(total); //reformat
    }

    inputs.map((index,entry) => {
        var col = columnExtractor(entry.id);
        if(column[col] == undefined)column[col] = new Array();
        column[col].push(entry);
        if(index < 12) {
            jQuery(entry).on('change', sumValues)
            jQuery(entry).on('keypress', function(evt){
                if(evt.which < 48 || evt.which > 57){
                    evt.preventDefault();
                    return false;
                };
            });
            jQuery(entry).on('keyup', function(){
                var value = jQuery(this).val();
                value = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                jQuery(this).val(value)
            })     
        };      
        if(index > 11) {
            jQuery(entry).attr('readonly', true);
        }
    });
```
### Totali CC01D
In onReady
```javascript

    var inputs = jQuery("#QID86 input");
    var column = [ ];
    
    function columnExtractor(value){
        value = value.slice(12);
        switch(value[0] + value[1]){
            case('8~'): return 0
            case('9~'): return 1
            case('10'): return 2
            default : return 3
        }    
    };

    function sumValues(e){
        var vals = [];
        var col = columnExtractor(e.target.id);
        vals = column[col].map((entry, index) => {
            if(index < 3){
                return jQuery(entry).val().replaceAll('.', ''); //unformat
            }else {
                return 0
            }
        });
        vals = vals.map(Number)
        var total = vals.reduce((a,b) => {return a +b},0);
        total = total.toString();
        total = total.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        jQuery(column[col][3]).val(total); //reformat
    }

    inputs.map((index,entry) => {
        var col = columnExtractor(entry.id);
        if(column[col] == undefined)column[col] = new Array();
        column[col].push(entry);
        if(index < 12) {
            jQuery(entry).on('change', sumValues)
            jQuery(entry).on('keypress', function(evt){
                if(evt.which < 48 || evt.which > 57){
                    evt.preventDefault();
                    return false;
                };
            });
            jQuery(entry).on('keyup', function(){
                var value = jQuery(this).val();
                value = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                jQuery(this).val(value)
            })     
        };      
        if(index > 11) {
            jQuery(entry).attr('readonly', true);
        }
    });

```

### Totali CD12

In onReady
```javascript

    var inputs = jQuery("#QID104 input");
    var column = [ ];
    
    function columnExtractor(value){
        value = value.slice(13);
        switch(value[0] + value[1]){
            case('15'): return 0
            case('16'): return 1
            case('17'): return 2
            default : return 3
        }    
    };

    function sumValues(e){
        var vals = [];
        var col = columnExtractor(e.target.id);
        vals = column[col].map((entry, index) => {
            if(index < 5){
                return jQuery(entry).val().replaceAll('.', ''); //unformat
            }else {
                return 0
            }
        });
        vals = vals.map(Number)
        var total = vals.reduce((a,b) => {return a +b},0);
        total = total.toString();
        total = total.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        jQuery(column[col][5]).val(total); //reformat
    }

    inputs.map((index,entry) => {
        var col = columnExtractor(entry.id);
        if(column[col] == undefined)column[col] = new Array();
        column[col].push(entry);
        if(index < 20) {
            jQuery(entry).on('change', sumValues)
            jQuery(entry).on('keypress', function(evt){
                if(evt.which < 48 || evt.which > 57){
                    evt.preventDefault();
                    return false;
                };
            });
            jQuery(entry).on('keyup', function(){
                var value = jQuery(this).val();
                value = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                jQuery(this).val(value)
            })     
        };      
        if(index > 19) {
            jQuery(entry).attr('readonly', true);
        }
    });
```
## Sezione D 

### Riepilogo Dati in Excel
Da inserire nella D00 in onReady, crea una variabile nel localStorage da riutilizzare per stabilire il numero di progetti da scaricare nel riepilogo finale.
```javascript
    function setLocalAmount(e){
		var amount = parseInt(jQuery("#QID132 input").val())
        localStorage.setItem('amount', amount);
    };

	jQuery("#QID132 input").on('change', setLocalAmount)
```  
Nella sezione "Descrizione Progetto" in onLoad
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
var fakeNext = "<input id='fakeNext' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='AVANTI' type='button' align='center'></input>";
jQuery("#Footer").prepend(excelButton);
jQuery('#Buttons').prepend(fakeNext);

var typeA = ["QID134", "QID135", "QID136", "QID137", "QID179"];  
var typeB = ["QID181", "QID139", "QID177", "QID140", "QID141","QID142", "QID143", "QID144", "QID178"]; 
var typeC = ["QID209"]; 

var ids = [];
    jQuery('div[questionId]').each(function(a,b,c){
        ids.push(jQuery(this).attr("questionId"));
});
ids = ids.slice(1);
var iterator = '';
if(ids[0][1] == '_') iterator ="#"+ ids[0][0] + "_";
else iterator = "#" + ids[0][0] + ids[0][1] + "_";

typeA = typeA.map((value, index) => {return iterator + value});
typeB = typeB.map((value,index) => {return iterator + value});
typeC = typeC.map((value, index) => {return iterator + value});
ids = ids.map((value, index) => {return "#" + value})

var array = [];

function sheetGenerator(){
    console.log('starting sheetGenerator')
    array.length = 0;
    ids.map((id, index) => {
        var test = jQuery(id);
        if(test[0] !== undefined && !(test[0].hasClassName('hidden'))) {
            if(typeA.includes(id)){
                var title = jQuery(id + " label")[0].textContent;
                title = title.replaceAll("\n" , " " );
                var input = jQuery(id + " input").val();
                var temp = [[title], [input], []];
                array = array.concat(temp);         
            } else if(typeB.includes(id)){
                var title = jQuery(id + " legend")[0].textContent;
                title = title.replaceAll("\n" , " " );
                var answer = '';
                if(jQuery(id + " .q-checked").length !== 0) answer = jQuery(id + " .q-checked")[1].textContent;
                var temp = [[title], [answer], []];
                array = array.concat(temp)
            } else if(typeC.includes(id)) {
                var title = jQuery(id + " label")[0].innerText;
                var heads = jQuery(id + " th");
                var inputs = jQuery(id + " input");
                var temp = [
                    [title],
                    ['-', heads[0].textContent], 
                    [heads[1].innerText, jQuery(inputs[0]).val()],
                    [heads[2].innerText, jQuery(inputs[1]).val()],
                    [heads[3].innerText, jQuery(inputs[2]).val()],
                    []
                ];
                array = array.concat(temp)
            }
        }  
    });
    return array
};

function downloadExcel(){
    console.log('download called with click')
    var sheet = sheetGenerator();
    var sezione = XLSX.utils.book_new();
    var title = "sezione D progetto" + iterator;
    XLSX.utils.book_append_sheet(sezione, XLSX.utils.aoa_to_sheet(sheet), title);
    XLSX.writeFile(sezione, 'Sezione D Progetto Corrente.xlsx');
}

function localStoring(){
    console.log('local storing called with click');
    var sheet = sheetGenerator();
    var progressive = iterator.replaceAll('#', '').replaceAll('_','')
    var title = "sezioned_" + progressive;
    localStorage.setItem(title, JSON.stringify(sheet));
    jQuery("#NextButton").trigger('click');
}

jQuery("#excelButton").on('click', downloadExcel);
jQuery('#fakeNext').on('click', localStoring);
```

### Totali D05
In onReady
```javascript
    var id = "QID209";
    var ids =  [];
    jQuery('div[questionId]').each(function(a,b,c){
        ids.push("#" + jQuery(this).attr("questionId"));
    });
    var versionId = '';
    ids.map(v => { if(v.includes(id)) versionId = v})
    var inputs = jQuery(versionId + " input");
    
    function sumValues(e){
        var one = jQuery(inputs[0]).val().replaceAll('.', '');
        if(one == '') one = 0;
        var two = jQuery(inputs[1]).val().replaceAll('.', '');
        if(two == '') two = 0;
        var total = parseInt(one) + parseInt(two);
        total = total.toString();
        total = total.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        jQuery(inputs[2]).val(total);   
    }

    inputs.map((index,entry) => {
        if(index == 0 || index == 1) {
            jQuery(entry).on('change', sumValues)
            jQuery(entry).on('keypress', function(evt){
                if(evt.which < 48 || evt.which > 57){
                    evt.preventDefault();
                    return false;
                };
            });
            jQuery(entry).on('keyup', function(){
                var value = jQuery(this).val();
                value = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                jQuery(this).val(value)
            })     
        };      
        if(index == 2) {
            jQuery(entry).attr('readonly', true);
        }
    });
```
### D02A, D02B - Impostare convalida data nella forma mm/aaaa
Inserire nella relativa domanda
```javascript
var first = "_QID136";
var second = "_QID137";
var ids =  [];
jQuery('div[questionId]').each(function(a,b,c){
    ids.push(jQuery(this).attr("questionId"));
}); 
ids.map(v => {
    if(v.includes(first)) first = v;
    if(v.includes(second)) second = v;
})
console.log(first, second)
jQuery("#QR\\~" + first).attr("type", "month")

jQuery("#QR\\~" + second).attr("type", "month")
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
Per nascondere 3 voci :

```javascript
var sideBar = jQuery("#Toc ul li");
    sideBar.map((index, entry) => {
        if(index == sideBar.length -1 || index == sideBar.length -2 || index == sideBar.length -3){
            jQuery(entry).hide()
        }
    })
```
Da inserire in ogni singola domanda della sezione di benvenuto nell'AddOnLoad e nell'AddOnUnloadnell'AddOnLoad per nascondere gli ultimi due link nell'indice generale. Va inserito inoltre nell' addOnUnload dell'header di ogni Sezione per impedire ai link di comparire se l'utente dovesse premere il bottone indietro 
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
Per nascondere gli ultimi 3 link:
```javascript
var observer = new MutationObserver(function() {
    const toc = document.querySelector("#TOCPage");
        if(toc) {
            var links = jQuery("#TOCPage li")

		links.map((index, entry) => {
			if(index == links.length -1 || index == links.length -2 || index == links.length -3){
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
## SEZIONE E

### Riepilogo Dati in Excel

In onLoad
```javascript
var body = jQuery("#SurveyEngineBody");
body.prepend('<script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>');

```
In onReady, modificare la variabile typeB inserendo gli id delle domande di tipo input tra virgolette, preceduti da hashtag e separati da virgola.
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
var fakeNext = "<input id='fakeNext' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='AVANTI' type='button' align='center'></input>";
jQuery("#Footer").prepend(excelButton);
jQuery('#Buttons').prepend(fakeNext);

var excluded = ["#QID232", "#QID233", "#QID261", "#QID277", "#QID289", "#QID299", "#QID309"];  

var ids = [];
    jQuery('div[questionId]').each(function(a,b,c){
        ids.push("#" + jQuery(this).attr("questionId"));
});
ids = ids.filter(i => !(excluded.includes(i)));

var typeA = ids.filter(i => jQuery(i + " li").length !== 0); 
var typeB = ["#QID235", "#QID239"] //inserire a mano gli id delle domande di tipo input

var array = [];

function sheetGenerator(){
    console.log('starting sheetGenerator')
    array.length = 0;
    ids.map((id, index) => {
        var test = jQuery(id);
        if(test[0] !== undefined && !(test[0].hasClassName('hidden'))) {
            if(typeA.includes(id)){
                var title = jQuery(id + " legend")[0].textContent;
                title = title.replaceAll("\n" , " " );
                var answer = '';
                if(jQuery(id + " .q-checked").length !== 0) answer = jQuery(id + " .q-checked")[1].textContent;
                var temp = [[title], [answer], []];
                array = array.concat(temp)         
            } else if(typeB.includes(id)){
                var title = jQuery(id + " label")[0].textContent;
                title = title.replaceAll("\n" , " " );
                var input = jQuery(id + " input").val();
                var temp = [[title], [input], []];
                array = array.concat(temp);
            }
        }  
    });
    return array
};

function downloadExcel(){
    console.log('download called with click')
    var sheet = sheetGenerator();
    var sezione = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(sezione, XLSX.utils.aoa_to_sheet(sheet), "Sezione E");
    XLSX.writeFile(sezione, 'Sezione E.xlsx');
}

function localStoring(){
    console.log('local storing called with click');
    var sheet = sheetGenerator();
    localStorage.setItem("sezionee", JSON.stringify(sheet));
    jQuery("#NextButton").trigger('click');
}

jQuery("#excelButton").on('click', downloadExcel);
jQuery('#fakeNext').on('click', localStoring);

```


## Riepilogo finale dati in Excel

## Benvenuto

Inserire questo snippet nell'onReady della domanda "I tuoi dati" della sezione di benvenuto, il codice controlla all'apertura della sezione se nella memoria locale siano già salavate delle sezioni e nel caso le cancella in modo da non far comparire nel download finale dati di sessioni precedenti.
```javascript
Object.keys(localStorage).map((e,i) => {
    if(e.includes('sezione')) localStorage.removeItem(e)
})
```
### Codice
Da inserire in onLoad in "Conferma Invio"
```javascript
var body = jQuery("#SurveyEngineBody");
body.prepend('<script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>');
```
Da inserire in onReady
```javascript
var excelButton = "<div style='text-align: center; display: center'><input id='excelButton' class='JumpButton Button' style= '-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: rgba(0,0,0,0); direction: inherit; box-sizing: border-box; font-family: sans-serif; border: none; color: #fff; padding: 8px 20px; cursor: pointer; margin: 10; text-align: center; text-decoration: none; -webkit-appearance: none; transition: background .3s; background-color: #0059b3; font-size: 1.125rem; border-radius: 0px;'  title='XLSX button' value='SALVA IN EXCEL' type='button' align='center'></input></div>";
jQuery("#Footer").prepend(excelButton);

function downloadRecap(){
    console.log('download called with click')
    var array = (Object.keys(localStorage).filter(key => key.includes('sezione')));
    array = array.sort((a,b) => a.localeCompare(b, undefined, {numeric: true}) );
    var workbook = XLSX.utils.book_new();
    array.map((v,i) => {
        var sheetTitle = v;
        var temp = JSON.parse(localStorage.getItem(v));
        var sheet = XLSX.utils.aoa_to_sheet(temp);
        XLSX.utils.book_append_sheet(workbook, sheet, sheetTitle)
    })
    XLSX.writeFile(workbook, 'riepilogo.xlsx');
}

jQuery("#excelButton").on('click', downloadRecap);
```
### Spiegazione funzionamento salvataggio riepilogo finale in Excel
Il questionario viene salvato per sezione nel browser ogni volta che l'utente preme il tasto avanti senza che questi ne abbia notifica. 

1) Se si compila un'intera sezione e si preme il tasto indietro non avverrà alcun salvataggio, analogamente non ci sarà salvataggio se l'utente, una volta compilata una sezione, passa alla successiva usando l'indice.

2) Se si torna su sezioni già compilate e salvate in automatico e si cambiano i dati, premendo avanti la copia salvata in locale verrà sovrascritta completamente dai nuovi dati presenti a schermo. Il processo non è reversibile.

3) Le varie sezioni vengono salvate così come appaiono,ad esempio una domanda opzionale che compare solo in base a una risposta precedente o una domanda non destinata all'ente a cui appartiene l'utente che compila il form non verrà mai salvata in quanto non è visualizzata a schermo.

4) Anche se non si risponde a una domanda questa verrà comunque salvata nel file excel se è presente nel form.

Affinché il riepilogo completo di tutte le sezioni funzioni è necessario che ogni singola sezione sia stata visualizzata sul computer da cui si intende scaricare il file excel, nel browser da cui la si scarica, senza usare la navigazione in incognito, spostandosi tra sezioni premendo il tasto avanti e senza aver cancellato i dati di navigazione tra una sessione e l'altra.

### Banner di ringraziamento finale
In conferma d'invio nell'onReady:
```javascript
var test = window.location.href.toString().replaceAll('https://questionari.agid.gov.it/jfe/form/', '')
jQuery("#NextButton").on('click', function(){
	   localStorage.setItem(test, 'yes');
	});
```

In Benvenuto nell'onReady di Q.15 "I tuoi dati"
```javascript
var test = window.location.href.toString().replaceAll('https://questionari.agid.gov.it/jfe/form/', '')
var sent = localStorage.getItem(test);
if(sent === 'yes'){ 
    jQuery("#EndOfSurvey").hide()

    var thankNote = '<div id="thankNote" style="display: center; text-align: center; padding: 10px; font-family: sans-serif; border: none; margin: 10px; font-weight: bold; font-size: large "> Grazie per aver completato il questionario! Vi invitiamo a salvare in formato PDF la successiva pagina web di riepilogo dati.</div>';

    jQuery("#QID3").prepend(thankNote)
};
```
