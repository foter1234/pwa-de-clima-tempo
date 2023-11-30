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

//3e49a9f061362db6a52d3f6eae67fe1c
//https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}

const chaveapi = "3e49a9f061362db6a52d3f6eae67fe1c";
let posicaoInicial;


const capturarLocalizacao = document.getElementById('localizacao');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
const mapa = document.getElementById('mapa');




const cidade = document.querySelector("#local")
const botao = document.querySelector("#capturaClima")
const cidadeElemento = document.querySelector("#city")
const temperaturaElemento = document.querySelector("#temperatura")
const descricaoElemento = document.querySelector("#descricao")
const umidadeElemento = document.querySelector("#umidade")



const climaLocalizacao = async(posicao)=>{
  posicaoInicial =posicao;

  latitude.innerHTML = posicaoInicial.coords.latitude;
  longitude.innerHTML = posicaoInicial.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${posicaoInicial.coords.latitude}&lon=${posicaoInicial.coords.longitude}&units=metric&appid=${chaveapi}&lang=pt_br`
 
  const res= await fetch(url)
  const data = await res.json()
  
  return data

}

const cidadeInput = async(city)=>{
 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${chaveapi}&lang=pt_br`

  const res= await fetch(url)
  const data = await res.json()
  
  return data
}

const buscacidade = async (city)=>{
 const data= await cidadeInput(city)

 cidadeElemento.innerText = data.name
 temperaturaElemento.innerText = parseInt(data.main.temp)
 descricaoElemento.innerText = data.weather[0].description
 umidadeElemento.innerText = parseInt(data.main.humidity)
 latitude.innerText = parseFloat(data.coord.lat)
 longitude.innerText = parseFloat(data.coord.lon)

}

const buscaPosicao= async (posicao)=>{

  const data= await climaLocalizacao(posicao)
 
  cidadeElemento.innerText = data.name
  temperaturaElemento.innerText = parseInt(data.main.temp)
  descricaoElemento.innerText = data.weather[0].description
  umidadeElemento.innerText = parseInt(data.main.humidity)
 }

const erro = (error) =>{

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


botao.addEventListener("click", (e) =>{
const city =cidade.value
buscacidade(city)
})
capturarLocalizacao.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(buscaPosicao, erro)
})