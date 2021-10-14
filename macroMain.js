function onOpen(e) {  
    tokenPropertys();  
  return;
};

//Botao LIMPAR PLANILHA
function btnLimparPlanilha() {
  
  //produto
  SpreadsheetApp.getActive().getRange('B6:D11').clear({contentsOnly: true, skipFilteredRows: true});  
  SpreadsheetApp.getActive().getRange('E8:H8').clear({contentsOnly: true, skipFilteredRows: true});  
  SpreadsheetApp.getActive().getRange('F10').clear({contentsOnly: true, skipFilteredRows: true});  
  
  //lista de variacaoes
  SpreadsheetApp.getActive().getRange('A14:M63').clear({contentsOnly: true, skipFilteredRows: true});    

  return;
};

//Botao PESQUISAR PRODUTO
function btnPesquisaProdutoComVariacao() {

  verificaDataToken();

  btnLimparPlanilha();
  pesquisaProdutoPorId();
  pesquisarListaDeVariacaoPorProdutoId();

};

//Botao ATUALIZAR PRODUTOS
function btnAtualizarProdutos() {

  verificaDataToken();
  atualizarProdutoPorId();    
};

//Botao ATUALIZAR VARIACOES
function btnAtualizarVariacoes() {

  verificaDataToken();  
  atualizarVariacaoDeProdutoPorVariacaoId();
  criarNovaVariacaoDeProduto();
};

//BOTAO EXCLUIR VARIACAO
function btnExcluirVariacaoPorId() {

  verificaDataToken();

    var ui = SpreadsheetApp.getUi();
    var spreadsheet = SpreadsheetApp.getActive(); 
    var response = ui.prompt('Excluir Variação', 'Informe o ID da variação', ui.ButtonSet.YES_NO);    

    if (response.getSelectedButton() == ui.Button.YES) {
      
      if (response.getResponseText() > 0){                       
      
        var resposta = deleteVariacaoById(response.getResponseText());   
       
        if(resposta.code == 200){   
                
          for (var i = 0; i <= 100; i++){  

            if(spreadsheet.getRange(`A${14 + parseInt(i)}`).getValue() == response.getResponseText()) {

              spreadsheet.getRange(`M${14 + parseInt(i)}`).setValue('Deleted');
              return;
            }     
          }                
        } else {    

          for (var i = 0; i <= 100; i++){  

            if(spreadsheet.getRange(`A${14 + parseInt(i)}`).getValue() == response.getResponseText()) {
              
              spreadsheet.getRange(`M${14 + parseInt(i)}`).setValue('ERRO');
              return;
            }     
          }
        };
        
        return;        

      };
      ui.alert('Variação não selecionada para exclusão');

    } else if (response.getSelectedButton() == ui.Button.NO) {
       
       return;

    } else {
        return;
    };
};

function pesquisaProdutoPorId() {
      
  var spreadsheet = SpreadsheetApp.getActive();   
  var produto = getProdutoById(spreadsheet.getRange('B3').getValue());  

  if(!produto.Product.name > 0){
    SpreadsheetApp.getUi().alert('Não foi possível encontrar o produto.');
    return;
  };

  spreadsheet.getRange('B6').setValue(produto.Product.name);//nome
  spreadsheet.getRange('B7').setValue(produto.Product.price);//preco
  spreadsheet.getRange('B8').setValue(produto.Product.stock);//estoque
  spreadsheet.getRange('B9').setValue(produto.Product.promotional_price);//preco promocional
  spreadsheet.getRange('B10').setValue(produto.Product.start_promotion);//data inicial da promoção
  spreadsheet.getRange('C10').setValue(produto.Product.end_promotion);//data final da promoção
  spreadsheet.getRange('B11').setValue(produto.Product.ncm);//NCM isso ajuda na geração de NF
  spreadsheet.getRange('E8').setValue(produto.Product.weight);//peso do produto pai 
  spreadsheet.getRange('H8').setValue(produto.Product.length);//comprimento do produto pai
  spreadsheet.getRange('G8').setValue(produto.Product.width);//largura do produto pai
  spreadsheet.getRange('F8').setValue(produto.Product.height);//altura do produto pai
   

  if(produto.Product.ProductImage.length > 0){

    spreadsheet.getRange(`J6`).setValue(`=IMAGE("${produto.Product.ProductImage[0].http}")`);     

  } else {    

    spreadsheet.getRange(`J6`).setValue(`=IMAGE("${getLogoLoja()}")`);
  }  

  return;
};

function pesquisarListaDeVariacaoPorProdutoId() {  
  
  var spreadsheet = SpreadsheetApp.getActive();    

  var variacao = JSON.parse(getVariacaoListByProductId(spreadsheet.getRange('B3').getValue()));  
  
  try{
  
    spreadsheet.getRange('F10').setValue(`${variacao.Variants[0].Variant.Sku[0].type}`);//Posicao do Fuet - peso em gramas        
  }catch(e){

    spreadsheet.getRange('F10').setValue(`Produto sem variações cadastradas!`);//sem variacoes
    return;
  }
      
  for(var i in variacao.Variants) {     
    spreadsheet.getRange(`A${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.id}`);//Codigo da Refrencia (não preencher)   
    spreadsheet.getRange(`B${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.reference}`);//ID da Referencia
    spreadsheet.getRange(`C${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.Sku[0].value}`);//Nome da ref. (nome que aparece no site)
    spreadsheet.getRange(`D${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.stock}`);//qnt estoque
    spreadsheet.getRange(`E${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.price}`);//valor
    spreadsheet.getRange(`F${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.weight}`);//peso em g
    spreadsheet.getRange(`G${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.height}`);//altura em cm
    spreadsheet.getRange(`H${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.width}`);//largura em cm
    spreadsheet.getRange(`I${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.length}`);//comprimento em cm
    spreadsheet.getRange(`J${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.promotional_price}`);//preço da promoção
    spreadsheet.getRange(`K${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.start_promotion}`);//data inicial da promoção
    spreadsheet.getRange(`L${14 + parseInt(i)}`).setValue(`${variacao.Variants[i].Variant.end_promotion}`);//data final da promoção    
  };

  return;
};

function atualizarProdutoPorId() {  
    
  var spreadsheet = SpreadsheetApp.getActive();

  let alteracao = [];
    alteracao[0] = spreadsheet.getRange('B3').getValue();//Id Produto
    alteracao[1] = spreadsheet.getRange('B6').getValue();//Nome produto
    alteracao[2] = spreadsheet.getRange('B7').getValue();//Preço
    alteracao[3] = spreadsheet.getRange('B8').getValue();//Qtd Estoque alterado pelas variacoes
    alteracao[4] = spreadsheet.getRange('A3').getValue();//Sku(reference)
    alteracao[5] = spreadsheet.getRange('B11').getValue();//NCM      
    alteracao[6] = spreadsheet.getRange('B10').getValue();//Data promo inicio
    alteracao[7] = spreadsheet.getRange('C10').getValue();//Data promo fim       
    alteracao[8] = spreadsheet.getRange('E8').getValue();//peso em g
    alteracao[9] = spreadsheet.getRange('F8').getValue();//altura em em cm
    alteracao[10] = spreadsheet.getRange('G8').getValue();//largura em em cm
    alteracao[11] = spreadsheet.getRange('H8').getValue();//comprimento em cm
    alteracao[12] = spreadsheet.getRange('B9').getValue();//preco promocao   
  
  var resposta = putProdutoById(alteracao);  
  
  if(!resposta.code == 200)
    SpreadsheetApp.getUi().alert('Dados invalidos');
    
  return; 
};

function atualizarVariacaoDeProdutoPorVariacaoId() {

  var spreadsheet = SpreadsheetApp.getActive();            
  var ok = 0;
  var nok = 0;

      var i = 0;
      let alteracao = [];
      for (var i = 0; i <= 100; i++) {

      if(!spreadsheet.getRange(`A${14 + parseInt(i)}`).getValue() > 0 && !spreadsheet.getRange(`B${14 + parseInt(i)}`).getValue() > 0)
      {
        return;// SpreadsheetApp.getUi().alert(`Linhas Processadas [ ${ok} ] - Linhas Rejeitadas [ ${nok} ]`)          
      }

        alteracao[0] = spreadsheet.getRange('B3').getValue(); //id produto                 
        alteracao[1] = spreadsheet.getRange(`A${14 + parseInt(i)}`).getValue();//id variacao
        alteracao[2] = spreadsheet.getRange(`B${14 + parseInt(i)}`).getValue();//reference
        alteracao[3] = spreadsheet.getRange(`C${14 + parseInt(i)}`).getValue();//Sku[0].value
        alteracao[4] = spreadsheet.getRange(`D${14 + parseInt(i)}`).getValue();//stock
        alteracao[5] = spreadsheet.getRange(`E${14 + parseInt(i)}`).getValue();//price
        alteracao[6] = spreadsheet.getRange(`F${14 + parseInt(i)}`).getValue();//weight
        alteracao[7] = spreadsheet.getRange(`G${14 + parseInt(i)}`).getValue();//height
        alteracao[8] = spreadsheet.getRange(`H${14 + parseInt(i)}`).getValue();//width
        alteracao[9] = spreadsheet.getRange(`I${14 + parseInt(i)}`).getValue();//length
        alteracao[10] = spreadsheet.getRange(`J${14 + parseInt(i)}`).getValue();//promotional_price                         
        alteracao[11] =spreadsheet.getRange(`K${14 + parseInt(i)}`).getValue();//start_promo  
        alteracao[12] =spreadsheet.getRange(`L${14 + parseInt(i)}`).getValue();//end_promo              
        alteracao[13] = spreadsheet.getRange('F10').getValue(); //nome variacao                 

        var resposta = putVariacaoById(alteracao);  
        
        if(resposta.code == 200){
          ok++;
          spreadsheet.getRange(`M${14 + parseInt(i)}`).setValue('OK');
        } else {
          nok++;
          spreadsheet.getRange(`M${14 + parseInt(i)}`).setValue('ERRO');
        }

    };        

  return ;
};

function criarNovaVariacaoDeProduto() { 

  var spreadsheet = SpreadsheetApp.getActive(); 
  
  var i = 0;
  let inclusao = [];
  for (var i = 0; i <= 100; i++) {

    if(!spreadsheet.getRange(`A${14 + parseInt(i)}`).getValue() > 0 && !spreadsheet.getRange(`B${14 + parseInt(i)}`).getValue() > 0)  
      return;        
    
    if(!spreadsheet.getRange(`A${14 + parseInt(i)}`).getValue() > 0) {    

      inclusao[0] = spreadsheet.getRange('B3').getValue(); //id produto     
      inclusao[1] = spreadsheet.getRange(`E${14 + parseInt(i)}`).getValue();//price
      inclusao[2] = spreadsheet.getRange(`D${14 + parseInt(i)}`).getValue();//stock
      inclusao[3] = spreadsheet.getRange(`B${14 + parseInt(i)}`).getValue();//reference
      inclusao[4] = spreadsheet.getRange(`F${14 + parseInt(i)}`).getValue();//weight
      inclusao[5] = spreadsheet.getRange(`I${14 + parseInt(i)}`).getValue();//length
      inclusao[6] = spreadsheet.getRange(`H${14 + parseInt(i)}`).getValue();//width
      inclusao[7] = spreadsheet.getRange(`G${14 + parseInt(i)}`).getValue();//height
      inclusao[8] = spreadsheet.getRange(`K${14 + parseInt(i)}`).getValue();//start_promo  
      inclusao[9] = spreadsheet.getRange(`L${14 + parseInt(i)}`).getValue();//end_promo              
      inclusao[10] = spreadsheet.getRange(`J${14 + parseInt(i)}`).getValue();//promotional_price                         
      inclusao[11] = spreadsheet.getRange('F10').getValue();//Sku[0].Name
      inclusao[12] = spreadsheet.getRange(`C${14 + parseInt(i)}`).getValue();//Sku[1].value      

      var resposta = postVariacao(inclusao);  

      if(resposta.code == 201){                 
        spreadsheet.getRange(`A${14 + parseInt(i)}`).setValue(resposta.id);      
        spreadsheet.getRange(`M${14 + parseInt(i)}`).setValue('Created');
      } else {      
        spreadsheet.getRange(`M${14 + parseInt(i)}`).setValue('ERRO');
      };

    };                 
  };        

  return ;
};

