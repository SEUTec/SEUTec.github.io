/*
  Scripts Previsión Generación Ebergía Arranque TESA2
*/

const POT_TESA2_100x100 = 14;
const POT_MG_100x100 = POT_TESA2_100x100 / 2;

showTime();
setInterval(function () { showTime(); }, 1000);

// Functions definitions
function showTime() {
	document.getElementById('currentTime').innerHTML = new Date().toUTCString();
}

function intoKeyDown(){
  //alert("KeyDOwn on Carga: " + event.keyCode);
  if (event.keyCode == 13){ calcular(); }
}

function cargaKeyDown(){
  //alert("KeyDOwn on Carga: " + event.keyCode);
  if (event.keyCode == 13){ cargaMW(); }
}


// Calcular la previsió d'energia generada al final de l'hora actual
function calcular(){
  //alert("Calcular");
  let potNominada = document.getElementById("inptPotNominada").value;
  let energia = document.getElementById("inptEnergia").value;
  let potMG1 = document.getElementById("inPotMG1").value;
  let potMG2 = document.getElementById("inPotMG2").value;
  
  potNominada = parseFloat(potNominada);
  if (potNominada < 0) { potNominada = 0; document.getElementById("inptPotNominada").value = potNominada.toFixed(2); }
  if (potNominada > POT_TESA2_100x100) { potNominada = POT_TESA2_100x100; document.getElementById("inptPotNominada").value = potNominada;}
  
  energia = parseFloat(energia);
  if (energia < 0) { energia = 0; document.getElementById("inptEnergia").value = energia; }
  if (energia > POT_TESA2_100x100) { energia = POT_TESA2_100x100; document.getElementById("inptEnergia").value = energia.toFixed(2);}
  
  potMG1 = parseFloat(potMG1);
  if (potMG1 < 0) { potMG1 = 0; document.getElementById("inPotMG1").value = potMG1; }
  if (potMG1 > POT_MG_100x100) { potMG1 = POT_MG_100x100; document.getElementById("inPotMG1").value = potMG1.toFixed(2);}
  document.getElementById("potMG1p100").innerHTML = (potMG1 / POT_MG_100x100 * 100).toFixed(0);

  potMG2 = parseFloat(potMG2);
  if (potMG2 < 0) { potMG2 = 0; document.getElementById("inPotMG2").value = potMG2; }
  if (potMG2 > POT_MG_100x100) { potMG2 = POT_MG_100x100; document.getElementById("inPotMG2").value = potMG2.toFixed(2);}
  document.getElementById("potMG2p100").innerHTML = (potMG2 / POT_MG_100x100 * 100).toFixed(0);

  let potTESA2 = potMG1 + potMG2;
  document.getElementById("inPotTESA2").value = potTESA2.toFixed(2);
  
  const fechaHora = new Date();
  //let hora = fechaHora.getHours();
  let minutos = fechaHora.getMinutes();
  let minRestantes = 60 - minutos;   // Minutos restantes para finalizar hora actual
  //console.log("minRestantes: " + minRestantes);
  
  // Cálculo Previsión Energia Generada de Ahora a Final de hora
  // a Potencia Constante, en MWh
  let prevGeneraMG1 = potMG1 * minRestantes / 60;
  let prevGeneraMG2 = potMG2 * minRestantes / 60;
  //console.log("prevGeneraMG1: " + prevGeneraMG1);
  //console.log("prevGeneraMG2: " + prevGeneraMG2);
  
  prevFinalTESA2 = energia * minutos / 60 + prevGeneraMG1 + prevGeneraMG2;
  //console.log("prevFinalTESA2: " + prevFinalTESA2);

  let correcion;  // Declarar la variable global, no dentro del if, para poder utilizarla fuera.
  if ( potNominada * 0.95 > prevFinalTESA2  ) { 
    correccion = "SUBIR"; 
    //alert("SUBIR"); 
  } else if ( potNominada * 1.05 < prevFinalTESA2 ) { 
    correccion = "BAJAR"; 
    //alert("BAJAR");
  } else { 
    correccion = "MANTENER"; 
    //alert("MANTENER");
  }
  //console.log("correccion: " + correccion);

  document.getElementById("tempsRest").innerHTML = minRestantes.toFixed(2);  
  document.getElementById("resultado").innerHTML = prevFinalTESA2.toFixed(2);
  document.getElementById("correccion").innerHTML = correccion;  
}

function cargaMW(){
  //alert("cargaMW");
  carga = document.getElementById("inptCarga").value;
  carga = parseFloat(carga);

  // Limitar valors introduits
  if (carga < 0) { carga = 0; document.getElementById("inptCarga").value = carga; }
  if (carga > 100) { carga = 100; document.getElementById("inptCarga").value = carga;}
  
  potMW = carga * POT_MG_100x100 / 100;
  document.getElementById("potMW").innerHTML = potMW.toFixed(2);
}