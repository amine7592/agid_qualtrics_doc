
var timestamp = "Template scaricato il " + new Date().toLocaleString()
jQuery("#QID402 input").val(" " + jQuery("#QID402 input").val() + " " + timestamp).trigger("keyup")