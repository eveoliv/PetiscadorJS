/*
  https://portaldeparceiros.tray.com.br/loja-de-testes
  https://api.commerce.tray.com.br/app/webroot/api-docs/#!/products/view
*/

function formatPreco(valor) {
 
  try{
    if(valor.substring(0,2) == 'R$'){
    
      return parseFloat(valor.replace('R$',''));
    }
  }catch(e){
    return parseFloat(valor);
  };       
  return parseFloat(valor);
  
};

function evaluateDate(data) {

  if(isNaN(data) || !data > 0)     
    return  Utilities.formatDate(new Date(), "GMT-1", "yyyy-MM-dd");    
  
  return formatDate(data);
  
};

function evaluateDatePlus30(data) {  

  if(isNaN(data) || !data > 0)    
    return Utilities.formatDate(new Date(Date.now() + 1000*60*60*730), "GMT-1", "yyyy-MM-dd");     
  
  return formatDate(data);
  
};

function formatDate(data){

  return  Utilities.formatDate(data, "GMT-1", "yyyy-MM-dd");

};