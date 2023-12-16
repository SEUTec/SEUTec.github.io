/*
  Scripts Previsión Generación Ebergía Arranque TESA2
*/

const POT_TESA2_100x100 = 13.46;
const POT_MG_100x100 = POT_TESA2_100x100 / 2;

// Tiempo Necesario para Subir desde potencia Actual al 100%
const p100Subida = 100;  // % de Subida medidoa para referencia
const tmpSubida = 19;    // tiempo que ha tadado en subir dicho porcentaje en mimutos.
const velSubidaMG = p100Subida / tmpSubida;   // rampa subida %/min de los MGs

showTime();  // Para que no tarde 1s en mostrarse la hora
setInterval(function () { 
  showTime();
  calcular();
 }, 1000);

// Functions definitions
function showTime() {
	document.getElementById('currentTime').innerHTML = new Date().toLocaleString();
}

// function cargaKeyDown(){
//   //alert("KeyDOwn on Carga: " + event.keyCode);
//   if (event.keyCode == 13){ cargaMW(); }
// }

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
  if (potNominada > POT_TESA2_100x100) { potNominada = POT_TESA2_100x100; document.getElementById("inptPotNominada").value = potNominada.toFixed(2);}
  
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
  let minutos = fechaHora.getMinutes();
  let segundos = fechaHora.getSeconds();
                  // segundos / 60 Convierte segundos en minutos, 0-60s a 0-1
  let minRestantes = 60 - minutos - segundos / 60;   // Minutos restantes para finalizar hora actual
    
  // Cálculo Previsión Energia Generada de Ahora a Final de hora
  // a Potencia Constante, en MWh
  let prevGeneraMG1 = potMG1 * minRestantes / 60;
  let prevGeneraMG2 = potMG2 * minRestantes / 60;
  
  prevFinalTESA2 = energia * minutos / 60 + prevGeneraMG1 + prevGeneraMG2;
  
  document.getElementById("tempsRest").innerHTML = minRestantes.toFixed(2);  
  // Si comentem resultado y corrección a pot cte al HTML
  // tindrem que comentar la seva actualització per a que
  // s'actualitce la resta de calculs.
  // document.getElementById("resultado").innerHTML = prevFinalTESA2.toFixed(2);
  // document.getElementById("correccion").innerHTML = correccion;  

  // Incremento de Carga para llegar al 100% en %
  let dCMG1 = (100 - potMG1p100);
  let dCMG2 = (100 - potMG2p100);
  
  // Tiempo que van a tardar en hacer la subida
  let tMG1al100p100 = dCMG1 / velSubidaMG;
  let tMG2al100p100 = dCMG2 / velSubidaMG;
  
  // Incremento de Potencia para llegar al 100% en MW.
  let dPMG1MW = dCMG1 * POT_MG_100x100 / 100;
  let dPMG2MW = dCMG2 * POT_MG_100x100 / 100;
  
  // Potencia extra generada durante la subida
  // al 100 en último momento, hay que considerar el caso
  // en que no se finaliza la subida al final de la hora
  // y el caso en que se finaliza la subida antes del final de hora
  // tiempo en minutos => 60 para convertir a tiempo en horas
  let potExtrSubidaMG1 = dPMG1MW * tMG1al100p100 / 60.0 / 2.0;
  let potExtrSubidaMG2 = dPMG2MW * tMG2al100p100 / 60.0 / 2.0;

  // Energia generada con la subida a última hora
  prevFinalTESA2 = energia * minutos / 60.0 +
    prevGeneraMG1 + prevGeneraMG2 +
    potExtrSubidaMG1 + potExtrSubidaMG2;

  let correcion;  // Declarar la variable global, no dentro del if, para poder utilizarla fuera.
  //potNominada = 4;    // Per testar indicador de correció.
  //prevFinalTESA2 = 4;
  //console.log(potNominada);
  //console.log(prevFinalTESA2);
  errorAdmisibleP100 = 2;  // Error admisible en %
  errorAdmisibleP1 = errorAdmisibleP100 / 100;
  //console.log(errorAdmisibleP1);
  if ( prevFinalTESA2 < potNominada * (1 - errorAdmisibleP1)) { 
    correccion = "SUBIR";   // Si prev. menor que nominada -10%, Subir Potencia.
    } else if ( prevFinalTESA2 > potNominada * (1 + errorAdmisibleP1)) { 
      correccion = "BAJAR";   // Si prev. major que nominada +10%, Bajar Potencia.
    } else { 
      correccion = "MANTENER"; 
  }
  
  document.getElementById("resultado100").innerHTML = prevFinalTESA2.toFixed(2);

  document.getElementById("correccion100").innerHTML = correccion;

  document.getElementById("tMG1al100").innerHTML = tMG1al100p100.toFixed(1);
  const timeOutMG1 = document.getElementById("timeOutMG1");
  timeOutMssg(timeOutMG1, minRestantes, tMG1al100p100);

  document.getElementById("tMG2al100").innerHTML = tMG2al100p100.toFixed(1);
  const timeOutMG2 = document.getElementById("timeOutMG2");
  timeOutMssg(timeOutMG2, minRestantes, tMG2al100p100);
}

function timeOutMssg(timeOutMG, minRestantes, tMGal100p100){
  if (minRestantes <= tMGal100p100) {
    timeOutMG.innerHTML = "SUBIR 100%";  
    timeOutMG.style.color = "red";
  } else if (minRestantes <= tMGal100p100 + 0.5) {
    timeOutMG.innerHTML = "SUBIR 100% ?";  
    timeOutMG.style.color = "orange";
  } else if (minRestantes <= tMGal100p100 + 1) {
    timeOutMG.innerHTML = "SUBIR 100% ?";  
    timeOutMG.style.color = "black";
  } else if (minRestantes <= tMGal100p100 + 1.5) {
    timeOutMG.innerHTML = "subir 100% ?";  
    timeOutMG.style.color = "black";
  } else {
    timeOutMG.innerHTML = "Ver Previsión";  
    timeOutMG.style.color = "black";
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