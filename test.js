
var blurDiv = '<div id="blurDiv" style="background-color: white; opacity: 0.9; width: 100%; height: 100%; position: absolute; z-index: 9999"> <div style="display: center; text-align: center; padding: 20%; font-family: sans"> <h3>ATTENZIONE!</h3> <p> Il questionario è ottimizzato per Google Chrome, usa Chrome stupidino! </p></div> </div>'

var UA = navigator.userAgent;
if(!UA.includes("Chrome" || "chrome")){
    jQuery("#SurveyEngineBody").prepend(blurDiv)
}



