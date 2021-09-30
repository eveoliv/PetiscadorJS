function getProdutoById(id) {
  
  return JSON.parse(UrlFetchApp.fetch(`${getUrlLoja()}products/${id}?access_token=${PropertiesService.getScriptProperties().getProperty('aToken')}`)); 

};

function getVariacaoListByProductId(id) {

  return UrlFetchApp.fetch(`${getUrlLoja()}products/variants/?access_token=${PropertiesService.getScriptProperties().getProperty('aToken')}&product_id=${id}`);
 
};

function getVariacaoById(id) {
  
  return JSON.parse(UrlFetchApp.fetch(`${getUrlLoja()}products/variants/${id}?access_token=${PropertiesService.getScriptProperties().getProperty('aToken')}`));
    
};

function getCategoriaById(id) {
  
  return JSON.parse(UrlFetchApp.fetch(`${getUrlLoja()}categories/${id}?access_token=${PropertiesService.getScriptProperties().getProperty('aToken')}`));
  
};

function getPropriedadeById(id) {
  
  return JSON.parse(UrlFetchApp.fetch(`${getUrlLoja()}products/properties/?access_token=${PropertiesService.getScriptProperties().getProperty('aToken')}&id=${id}`));  

};

function putProdutoById(alteracao) {       
    
  alteracao[6] = evaluateDate(alteracao[6]);
  alteracao[7] = evaluateDatePlus30(alteracao[7]);

  alteracao[2] = formatPreco(alteracao[2]);  
  alteracao[12] = formatPreco(alteracao[12]);  

  var formData = {
    "Product": {      
      "ncm": `"${alteracao[5]}"`,     
      "price": `${alteracao[2]}`, 
      "promotional_price": `${alteracao[12]}`,      
      "start_promotion": `${alteracao[6]}`,
      "end_promotion": `${alteracao[7]}`,
      "stock": `${alteracao[3]}`,              
      "weight": `${alteracao[8]}`,
      "length": `${alteracao[11]}`,
      "width": `${alteracao[10]}`,
      "height": `${alteracao[9]}`
    }
  };  

  var options = {'method' : 'put','contentType': 'application/json','payload' : JSON.stringify(formData)};     
  
  return JSON.parse(UrlFetchApp.fetch(`${getUrlLoja()}products/${alteracao[0]}?access_token=${PropertiesService.getScriptProperties().getProperty('aToken')}`, options));
         
};

function putVariacaoById(alteracao){  

  alteracao[11] = evaluateDate(alteracao[11]);
  alteracao[12] = evaluateDatePlus30(alteracao[12]);

  alteracao[5] = formatPreco(alteracao[5]);
  alteracao[10] = formatPreco(alteracao[10]);    

  if(!alteracao[1] > 0)  
    return '400';

  var formData = {
    "Variant": {                       
      "product_id": `${alteracao[0]}`,    
      "price": `${alteracao[5]}`,       
      "stock": `${alteracao[4]}`,     
      "reference": `${alteracao[2]}`,            
      "weight": `${alteracao[6]}`,
      "length": `${alteracao[9]}`,
      "width": `${alteracao[8]}`,
      "height": `${alteracao[7]}`,
      "start_promotion": `${alteracao[11]}`,
      "end_promotion": `${alteracao[12]}`,
      "promotional_price": `${alteracao[10]}`,
      "Sku": [
        {
          "type": `${alteracao[13]}`,
          "value": `${alteracao[3]}`
        }
      ]      
    }
  }

  var options = {'method' : 'put','contentType': 'application/json','payload' : JSON.stringify(formData)};      
      
  return JSON.parse(UrlFetchApp.fetch(`${getUrlLoja()}products/variants/${alteracao[1]}?access_token=${PropertiesService.getScriptProperties().getProperty('aToken')}`,options));   
  
};

function postVariacao(inclusao) {

  inclusao[8] = evaluateDate(inclusao[8]);
  inclusao[9] = evaluateDatePlus30(inclusao[9]);

  inclusao[1] = formatPreco(inclusao[1]);
  inclusao[10] = formatPreco(inclusao[10]);  

  var formData = {
    "Variant": {
      "product_id": `${inclusao[0]}`,      
      "price": `${inclusao[1]}`,       
      "stock": `${inclusao[2]}`,       
      "reference": `${inclusao[3]}`,
      "weight": `${inclusao[4]}`,
      "length": `${inclusao[5]}`,
      "width": `${inclusao[6]}`,
      "height": `${inclusao[7]}`,
      "start_promotion": `${inclusao[8]}`,
      "end_promotion": `${inclusao[9]}`,
      "promotional_price": `${inclusao[10]}`, 
      "Sku": [
        {
          "type": `${inclusao[11]}`,
          "value": `${inclusao[12]}`
        }
      ]      
    }
  }

  var options = {'method' : 'post','contentType': 'application/json','payload' : JSON.stringify(formData)};                      

  return JSON.parse(UrlFetchApp.fetch(`${getUrlLoja()}products/variants/?access_token=${PropertiesService.getScriptProperties().getProperty('aToken')}`,options));   

};

function deleteVariacaoById(id) {

  var options = { 'method' : 'delete','contentType': 'application/json'};  

  return JSON.parse(UrlFetchApp.fetch(`${getUrlLoja()}products/variants/${id}?access_token=${PropertiesService.getScriptProperties().getProperty('aToken')}`,options));    

};
