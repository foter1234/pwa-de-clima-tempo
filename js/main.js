//registrando a service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg;
      reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });

      console.log('Service worker registrada! 😎', reg);
    } catch (err) {
      console.log('😥 Service worker registro falhou: ', err);
    }
  });
}

let posicaoInicial;


const capturarLocalizacao = document.getElementById('localizacao');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
const mapa = document.getElementById('mapa');


const sucesso = (posicao) => {

posicaoInicial =posicao;

latitude.innerHTML = posicaoInicial.coords.latitude;
longitude.innerHTML = posicaoInicial.coords.longitude;
mapa.src = `https://maps.google.com/maps?q=${posicaoInicial.coords.latitude},${posicaoInicial.coords.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`

}

const erro = (erro) =>{

let errorMessage

switch (error.code) {
  case 0:
 errorMessage="erro desconhecido"
  break;
  case 1:
 errorMessage="permissão negada!"
  break;
  case 2:
 errorMessage="captura Desconhecida!"
  break;
  case 3:
 errorMessage="Tempo de solicitação excedido!"
  break;
}
console.log("ocorreu um erro:"+ errorMessage)
}
capturarLocalizacao.addEventListener('click', () => {
navigator.geolocation.getCurrentPosition(sucesso, erro)
})