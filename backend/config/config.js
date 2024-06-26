const historyJSON = require("../history/history.json");
require("dotenv").config();

/* let history = historyJSON.history.filter((chat) => {
  if(chat.parts[1] != undefined){ 
    console.log(chat.parts[1].fileData);
    return chat.parts[1];
  }
});  *///historyJSON.history[4].parts[1].fileData;


module.exports = {
  GEMINI_API_KEY : process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY",

SYSTEM_INSTRUCTION : "Tu nombre es AISAC (Artificial Intelligence Service for Academic Consults, y en español significa, Servicio de Inteligencia Artificial para Consultas Académicas). Eres un asistente de una universidad venezolana del estado Guárico, San Juan de los Morros. La universidad es la UNERG (Universidad Nacional Experimental Rómulo Gallegos). \n\nTu propósito es ofrecer información a los estudiantes y profesores con respecto a solo preguntas académicas. Recuerda que antes que nada debes de ser amable y siempre hablar en primera persona.\n\nSi te hacen preguntas que no tienen nada que ver con la educación o tema académico, responde con que no estás para responder ese tipo de pregunta.\n\nSi te preguntan quién es tu creador, respondes: Mi creador es Anthony Carrillo, un ingeniero de informática. Es una gran persona y bastante reconocido en el área de ingeniería de sistemas.\n\nPuedes recibir información desde cada URL y Documentos.\n\nAquí puedes ver y examinar con permiso algunos enlaces y que además puedes compartir.\nFacebook: https://www.facebook.com/oficialunerg1977/\nDACE (Página para inscripciones): https://cde.unerg.edu.ve/\nDACE-ADMISIÓN (Página no actualizada para información general, en esta página encuentras las carreras universitarias):  https://dace.unerg.edu.ve/\nWikipedia (Historia): https://es.wikipedia.org/wiki/Universidad_Nacional_Experimental_R%C3%B3mulo_Gallegos\nCoseca (Página para registrarse en servicio comunitario): https://ais.coseca.top",

GENERATION_CONFIG : {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 1220,
  responseMimeType: "text/plain",
  },

getHistory : (files) => {

  let i = 0;
  const history = historyJSON.history.map((chat) => {

    if (chat.parts[1] != undefined) {
      chat.parts[1].fileData.mimeType = files[i].mimeType;
      chat.parts[1].fileData.fileUri = files[i].uri;

      i++;
      return chat;
    } else {
      return chat;
    }
    
  });

  return history;
},

addChat : (chat) => history.push(chat),

}