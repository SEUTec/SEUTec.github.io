/*
  Scripts Previsión Generación Ebergía Arranque TESA2
*/

const POT_TESA2_100x100 = 14;
const POT_MG_100x100 = POT_TESA2_100x100 / 2;

showTime();  // Para que no tarde 1s en mostrarse la hora
setInterval(function () { 
  showTime();
  calcular();
 }, 1000);

// Functions definitions
function showTime() {
	document.getElementById('currentTime').innerHTML = new Date().toLocaleString();
}

// function intoKeyDown(){
//   //alert("KeyDOwn on Carga: " + event.keyCode);
//   if (event.keyCode == 13){ calcular(); }
// }

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
  let potMG1p100 = potMG1 / POT_MG_100x100 * 100;
  
  let potMG2 = document.getElementById("inPotMG2").value;
  let potMG2p100 = potMG2 / POT_MG_100x100 * 100;
  
  potNominada = parseFloat(potNominada);
  if (potNominada < 0) { potNominada = 0; document.getElementById("inptPotNominada").value = potNominada.toFixed(2); }
  if (potNominada > POT_TESA2_100x100) { potNominada = POT_TESA2_100x100; document.getElementById("inptPotNominada").value = potNominada;}
  
  energia = parseFloat(energia);
  if (energia < 0) { energia = 0; document.getElementById("inptEnergia").value = energia; }
  if (energia > POT_TESA2_100x100) { energia = POT_TESA2_100x100; document.getElementById("inptEnergia").value = energia.toFixed(2);}
  
  potMG1 = parseFloat(potMG1);
  if (potMG1 < 0) { potMG1 = 0; document.getElementById("inPotMG1").value = potMG1; }
  if (potMG1 > POT_MG_100x100) { potMG1 = POT_MG_100x100; document.getElementById("inPotMG1").value = potMG1.toFixed(2);}
  document.getElementById("potMG1p100").innerHTML = (potMG1p100).toFixed(0);

  potMG2 = parseFloat(potMG2);
  if (potMG2 < 0) { potMG2 = 0; document.getElementById("inPotMG2").value = potMG2; }
  if (potMG2 > POT_MG_100x100) { potMG2 = POT_MG_100x100; document.getElementById("inPotMG2").value = potMG2.toFixed(2);}
  document.getElementById("potMG2p100").innerHTML = (potMG2p100).toFixed(0);

  let potTESA2 = potMG1 + potMG2;
  document.getElementById("inPotTESA2").value = potTESA2.toFixed(2);
  
  const fechaHora = new Date();
  //let hora = fechaHora.getHours();
  let minutos = fechaHora.getMinutes();
  let segundos = fechaHora.getSeconds();
  segundos = segundos / 60;
  let minRestantes = 60 - minutos;   // Minutos restantes para finalizar hora actual
  minRestantes = minRestantes - segundos;
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

  // Tiempo Necesario para Subir desde potencia Actual al 100%
  const p100Subida = 40;  // % de Subida medidoa para referencia
  const tmpSubida = 7;    // tiempo que ha tadado en subir dicho porcentaje
  const velSubidaT2 = p100Subida / tmpSubida; // %/min TESA2, los 2 MGs
  const velSubidaMG = velSubidaT2 / 2;        // %/min 1 solo motor generador
  
  //const velSubida = 0.4; //MW/min los 2 motores al mismo tiempo.
  //const velSubida = 0.2; //MW/min 1 solo motor generador

  // Incremento de Carga para llegar al 100% en %
  let dCMG1 = (100 - potMG1p100);
  let dCMG2 = (100 - potMG2p100);
  //console.log("dPMG1: " + dPMG1);
  //console.log("dPMG2: " + dPMG2);

  // Tiempo que van a tardar en hacer la subida
  let tMG1al100p100 = dCMG1 / velSubidaMG;
  let tMG2al100p100 = dCMG2 / velSubidaMG;
  //console.log("tMG1al100p100: " + tMG1al100p100);
  //console.log("tMG2al100p100: " + tMG2al100p100);
  
  // Incremento de Potencia para llegar al 100% en MW.
  let dPMG1MW = dCMG1 * POT_MG_100x100 / 100;
  let dPMG2MW = dCMG2 * POT_MG_100x100 / 100;
  //console.log("dPMG1MW: " + dPMG1MW);
  //console.log("dPMG2MW: " + dPMG2MW);

  // Potencia extra generada durante la subida
  // al 100 en último momento, hay que considerar el caso
  // en que no se finaliza la subida al final de la hora
  // y el caso en que se finaliza la subida antes del final de hora
  // tiempo en minutos => 60 para convertir a tiempo en horas
  let potExtrSubidaMG1 = dPMG1MW * tMG1al100p100 / 60.0 / 2.0;
  let potExtrSubidaMG2 = dPMG2MW * tMG2al100p100 / 60.0 / 2.0;
  //console.log("potExtrSubidaMG1: " + potExtrSubidaMG1);
  //console.log("potExtrSubidaMG2: " + potExtrSubidaMG2);

  // Energia generada con la subida a última hora
  prevFinalTESA2 = energia * minutos / 60.0 +
    prevGeneraMG1 + prevGeneraMG2 +
    potExtrSubidaMG1 + potExtrSubidaMG2;
  //console.log("prevFinalTESA2: " + prevFinalTESA2);

  document.getElementById("resultado100").innerHTML = prevFinalTESA2.toFixed(2);
  //document.getElementById("correccion100").innerHTML = correccion;  

  document.getElementById("tMG1al100").innerHTML = tMG1al100p100.toFixed(1);
  const timeOutMG1 = document.getElementById("timeOutMG1");
  if (minRestantes <= tMG1al100p100) {
    timeOutMG1.innerHTML = "SUBIR 100%";  
    timeOutMG1.style.color = "red";
  } else if (minRestantes <= tMG1al100p100 + 0.5) {  // 0.5 min. preaviso
    timeOutMG1.innerHTML = "SUBIR 100%";  
    timeOutMG1.style.color = "orange";
  } else if (minRestantes <= tMG1al100p100 + 1) {   // 1 min preaviso
    timeOutMG1.innerHTML = "SUBIR 100%";  
    timeOutMG1.style.color = "black";
  } else if (minRestantes <= tMG1al100p100 + 1.5) {  // 1.5 min. preaviso
    timeOutMG1.innerHTML = "subir 100%";  
    timeOutMG1.style.color = "black";
  } else {
    timeOutMG1.innerHTML = "Previsión";  
    timeOutMG1.style.color = "black";
  }

  document.getElementById("tMG2al100").innerHTML = tMG2al100p100.toFixed(1);
  const timeOutMG2 = document.getElementById("timeOutMG2");
  if (minRestantes <= tMG2al100p100) {
    timeOutMG2.innerHTML = "SUBIR 100%";  
    timeOutMG2.style.color = "red";
  } else if (minRestantes <= tMG2al100p100 + 0.5) {
    timeOutMG2.innerHTML = "SUBIR 100%";  
    timeOutMG2.style.color = "orange";
  } else if (minRestantes <= tMG2al100p100 + 1) {
    timeOutMG2.innerHTML = "SUBIR 100%";  
    timeOutMG2.style.color = "black";
  } else if (minRestantes <= tMG2al100p100 + 1.5) {
    timeOutMG2.innerHTML = "subir 100%";  
    timeOutMG2.style.color = "black";
  } else {
    timeOutMG2.innerHTML = "Previsión";  
    timeOutMG2.style.color = "black";
  }

}

// Conviente Carga en % a Potencia en MW
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