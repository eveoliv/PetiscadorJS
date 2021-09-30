function getToken() {

  var formData = {
    "consumer_key": "b66098c126b501369b5e8e8bc46e6277ca311cb8789fe39437b7c2a94848a1a5",
    "consumer_secret": "073ff27341823ece1d2e021e8a70c25420c210f4b6f867bd270284e14de9ea8e",
    "code": "ab181ec493f4176e10fdec6beb78966c14184e6a7c08c0608da0d82f67b07716"
  };

  var options = {
    'method' : 'post',
    'payload' : formData
  };
        
  return  JSON.parse(UrlFetchApp.fetch(`${getUrlLoja()}/auth`, options));
};

function tokenProperty() {

  var token = getToken();    

  PropertiesService.getScriptProperties().setProperties({
    'aToken': token.access_token,
    'rToken': token.refresh_token,
    'expire': token.date_expiration_access_token    
  }); 
  return;
};

function refreshToken(myToken) {      

  var uri = getUrlLoja();
  var result = UrlFetchApp.fetch(`${uri}auth?refresh_token=${myToken}`);

  var json = JSON.parse(result);
  return json.refresh_token;
};

function verificaDataToken() {
  var dataHoraAtual = new Date().valueOf();  
  var dataHoraToken = new Date(PropertiesService.getScriptProperties().getProperty('expire')).valueOf();  
  if( dataHoraAtual > dataHoraToken ) 
    tokenProperty()  

  return; 
};