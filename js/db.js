import { openDB } from "idb";

let db;
async function criarDB(){
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch  (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('anotacao', {
                            keyPath: 'localizacao'
                        });
                        store.createIndex('id', 'id');
                        console.log("banco de dados criado!");
                }
            }
        });
        console.log("banco de dados aberto!");
    }catch (e) {
        console.log('Erro ao criar/abrir banco: ' + e.message);
    }
}

window.addEventListener('DOMContentLoaded', async event =>{await criarDB();});

const chaveapi = "3e49a9f061362db6a52d3f6eae67fe1c";
let posicaoInicial;


const capturarLocalizacao = document.getElementById('localizacao');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');

const cidade = document.querySelector("#local")
const dia = document.querySelector("#data")
const hora = document.querySelector("#hora")

const dataElemento = document.querySelector("#data")
const horaElemento = document.querySelector("#hora")

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
 dataElemento.innerText = dia.value
 horaElemento.innerText = hora.value
 data.localizacao = `cidade:${data.name},data:${dia.value},horario:${hora.value}`;


 salvarDados(data);

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


botao.addEventListener("click", async(e) =>{
const city =cidade.value
const data = await cidadeInput(city);
buscacidade(city)

salvarDados(data);
})
capturarLocalizacao.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(buscaPosicao, erro)
})

const salvarDados = async (data) => {
    try {
      const transaction = db.transaction('anotacao', 'readwrite');
      const store = transaction.objectStore('anotacao');
  
      if (data.localizacao) {
        await store.add(data);
        console.log('Dados salvos no IndexedDB');
        return;
      }
  
      
      
    } catch (error) {
      console.error('Erro ao salvar dados no IndexedDB:', error);
    }
  };
