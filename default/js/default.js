
var Objeto_real = localStorage['mobile_login'];
//localStorage.clear();
if (Objeto_real) {
    var Objeto_json = JSON.parse(Objeto_real)
    var COMMON_URL_MOBILE = Objeto_json.url+'/mobile/';
}else{
    if(typeof $("#url").val()!='undefined'){
        var COMMON_URL_MOBILE = $("#url").val()+'/mobile/';
    }else{
        var COMMON_URL_MOBILE = '';
    }
}


if (!supports_html5_storage) {
    alert("Infelizmente, seu navegador não suporta IndexedDB");
}

function clearInputs(){
     $(":input").each(function(){
         $(this).val('');
     });
     geraDespesa(0,0);
}

//Verifica se suporta web storage
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}


//############## INICIO LOGIN #################################################
//#############################################################################
function loading(showOrHide) {
    setTimeout(function(){
        $.mobile.loading(showOrHide);
    }, 1); 
}

//Controle de login
function mobile_login() {
    
    loading('show'); 
    
    var dados = new Object();
    
    dados['USUARIO'] = $("#usuario").val();
    dados['SENHA'] = $("#senha").val();
    dados['URL']   = $("#url").val();
    
    if(dados['URL']!="")
    {   
        var ajax_file_url = 'verifica_url.php';

        //Verifica se existe http:// e se existe "/" no final
        if((dados['URL'].substr(0,7))!='http://'){
            dados['URL'] = 'http://'+dados['URL'];
            if((dados['URL'].substr(dados['URL'].length-1,1))=='/'){
                dados['URL'] = dados['URL'].substr(0,dados['URL'].length-1);
            }
        }    
    
        var ajax_file = dados['URL'] + '/mobile/login_mobile.php';
        
        COMMON_URL_MOBILE = dados['URL'] + '/mobile';
        
        $.ajax({
        type: 'POST',
        url: 'http://www.multidadosti.com/teste_mobile/mobile/'+ajax_file_url,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            url: COMMON_URL_MOBILE
        }
        }).then(function(data) 
        {
           
            if(data=='F')
            {
                loading('hide'); 
                alert('URL incorreta');
                window.location.href = '#page_login';
            }
            else
            {
                $.ajax({
                    type: 'POST',
                    url: ajax_file,
                    dataType: "jsonp",
                    crossDomain: true,
                    data: {
                        usuario: dados['USUARIO'],
                        senha: dados['SENHA'],
                        url: dados['URL']
                    }
                }).then(function(data) 
                {   
                    if (data['erro']) 
                    {
                        loading('hide'); 
                        alert(data['erro']);
                        window.location.href = '#page_login';

                    } else {
                        var Objeto = {'usuario_id': data['idsenha'], 
                                      'usuario_nome': data['usuario'], 
                                      'senha': data['senha'],
                                      'url': data['url'],
                                      'idempresa_vendedor': data ['idempresa_vendedor'],
                                      'codigo_auxiliar': data['codigo_auxiliar'],
                                      'cnpj': data['cnpj']};
                        localStorage.setItem('mobile_login', JSON.stringify(Objeto));
                        var Objeto_real = localStorage['mobile_login'];
                        var Objeto_json = JSON.parse(Objeto_real);

                        window.location.href = '#page_home';
                        window.location.reload();
                    }
                });
            }
        });
    }else{
        alert('Favor preencha os dados corretamente');
        window.location.href = '#page_login';
    }
}

function mobile_logout() {
    localStorage.clear();
    window.location.href = '#page_login';
}

function verifica_logado() {
    
    var Objeto_real = localStorage['mobile_login'];
    if (!Objeto_real) {
        
        var url = window.location;
        var urlString = url.toString();
        var urlArray = urlString.split("/");

        if (urlArray[5] != '') {
            window.location.href = "#page_login";
        }
        
        //window.location.href = COMMON_URL_MOBILE;
    }
}

//####################### FIM LOGIN ###########################################
//#############################################################################


//######################## TIMESHEET ##########################################
//#############################################################################
//Salva dados do timesheet
function salvar_timesheet()
{
    var dados = new Object();
    
    dados['idvendedor'] = Objeto_json.usuario_id;
    dados['idtimecard'] = $("#idtimecard").val();
    //dados['USUARIO_WS'] = Objeto_json.usuario_nome;
    //dados['SENHA_WS'] = Objeto_json.senha;
    //dados['CNPJ_EMPRESA'] = Objeto_json.cnpj;
    //dados['CODIGO_AUXILIAR_PREST'] = Objeto_json.codigo_auxiliar;
    dados['data'] = $("#data_trabalhada").val();
    dados['idcliente'] = $("#codigo_auxiliar").val();
    dados['idclienteprojeto'] = $("#codigo").val();

    dados['hora'] = $("#hora_inicial").val();
    dados['hora_fim'] = $("#hora_final").val();
    
    dados['idtarefa_utbms'] = $("#codigo_fase").val();
    dados['idatividade_utbms'] = $("#codigo_atividade").val();

    dados['narrativa_principal'] = $("#narrativa_principal").val();

    var ajax_file = COMMON_URL_MOBILE + 'save_lanctos.php';

    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            dados: dados,
            tipo: 'timesheet'
        }
    }).then(function(data) 
    { 
        alert(data);
        if(data=='Timesheet salvo com sucesso.'){
            $("#filtro_data_trabalhada").val($("#data_trabalhada").val());
            $('#filtro_data_trabalhada').trigger('change');
            window.location.href = "#page_relatorio"; 
        }
    });
 
}

function selecionaValor(valor, tipo, id, id2, nome2)
{
    $(".ui-body-" + tipo).val(valor);

    if (tipo == 'c')
    {
        $("#codigo_auxiliar").val(id);
        $("#codigo").val('');
        $(".ui-body-p").val('');
    }
    else if (tipo == 'p')
    {
        $("#codigo").val(id);

        if ($("#codigo_auxiliar").val() == '')
        {
            $("#codigo_auxiliar").val(id2);
            $(".ui-body-c").val(nome2);
        }else{
            changeCodigo($("#codigo_auxiliar").val(),id,0,0);
        }
    }
    else if (tipo == 't')
    {
        $("#codigo_fase").val(id);
    }
    else if (tipo == 'atividade')
    {
        $("#codigo_atividade").val(id);
    }

    $("ul").empty();
}



//#############################################################################
//######################## FIM TIMESHEET ######################################
//#############################################################################


//###### AUTO COMPLETE ######################################
$(document).on("pageinit", "#page_timesheet", function()
{
    
    // CLIENTE TIMESHEET
    $("#page_timesheet #autocomplete_cliente").on("listviewbeforefilter", function(e, data)
    {
        var $ul = $(this),
                $input = $(data.input),
                value = $input.val(),
                html = "";
        $ul.html("");

        if (value && value.length > 0) {
            codigo_cliente = $("#codigo_cliente").val();

            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
            $ul.listview("refresh");
            $.ajax({
                type: 'GET',
                url: COMMON_URL_MOBILE + "search.php?tipo=c&codigo=" + codigo_cliente,
                dataType: "jsonp",
                crossDomain: true,
                data: {
                    q: $input.val()
                }
            })
                    .then(function(response) {
                        $.each(response, function(i, val) {
                            html += "<li><a href='javascript:selecionaValor(\"" + val['nome'] + "\",\"c\",\"" + val['idcliente'] + "\");'>" + val['nome'] + "</a></li>";
                        });
                        $ul.html(html);
                        $ul.listview("refresh");
                        $ul.trigger("updatelayout");
                    });
        }
    });

    // PROJETO TIMESHEET
    $("#page_timesheet #autocomplete_projeto").on("listviewbeforefilter", function(e, data) {
        var $ul = $(this),
                $input = $(data.input),
                value = $input.val(),
                html = "";
        $ul.html("");
        if (value && value.length > 0) {
            idcliente = $("#codigo_auxiliar").val();
            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
            $ul.listview("refresh");
            $.ajax({
                type: 'GET',
                url: COMMON_URL_MOBILE + "search.php?tipo=p&idcliente=" + idcliente,
                dataType: "jsonp",
                //dataType: "json", // quando for interno deve habilitar este e ocultar datatype e crossDomain
                crossDomain: true,
                data: {
                    q: $input.val()
                }
            })
                    .then(function(response) {
                        $.each(response, function(i, val) {
                            html += "<li><a href='javascript:selecionaValor(\"" + val['nome_projeto'] + "\",\"p\",\"" + val['idclienteprojeto'] + "\",\"" + val['idcliente'] + "\",\"" + val['nome'] + "\");'>" + val['nome_projeto'] + "</a></li>";
                        });
                        $ul.html(html);
                        $ul.listview("refresh");
                        $ul.trigger("updatelayout");
                    });
        }
    });
});


//AUTO COMPLETE DESPESA########################################################
$(document).on("pageinit", "#page6", function()
{
    // CLIENTE DESPESA
    $("#page6 #autocomplete_cliente").on("listviewbeforefilter", function(e, data)
    {
        var $ul = $(this),
                $input = $(data.input),
                value = $input.val(),
                html = "";
        $ul.html("");

        if (value && value.length > 0)
        {
            codigo_cliente = $("#codigo_cliente").val();

            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
            $ul.listview("refresh");
            $.ajax({
                type: 'GET',
                url: COMMON_URL_MOBILE + "search.php?tipo=c&codigo=" + codigo_cliente,
                dataType: "jsonp",
                crossDomain: true,
                data: {
                    q: $input.val()
                }
            })
                    .then(function(response) {
                        $.each(response, function(i, val) {
                            html += "<li><a href='javascript:selecionaValorDespesa(\"" + val['nome'] + "\",\"c\",\"" + val['idcliente'] + "\");'>" + val['nome'] + "</a></li>";
                        });
                        $ul.html(html);
                        $ul.listview("refresh");
                        $ul.trigger("updatelayout");
                    });
        }
    });

    // PROJETO DESPESA
    $("#page6 #autocomplete_projeto").on("listviewbeforefilter", function(e, data) {
        var $ul = $(this),
                $input = $(data.input),
                value = $input.val(),
                html = "";
        $ul.html("");
        if (value && value.length > 0) {
            codigo_auxiliar = $("#idcliente_despesa").val();
            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
            $ul.listview("refresh");
            $.ajax({
                type: 'GET',
                url: COMMON_URL_MOBILE + "search.php?tipo=p&idcliente=" + codigo_auxiliar,
                dataType: "jsonp",
                crossDomain: true,
                data: {
                    q: $input.val()
                }
            })
                    .then(function(response) {
                        
                        $.each(response, function(i, val) {
                            html += "<li ><a href='javascript:selecionaValorDespesa(\"" + val['nome_projeto'] + "\",\"p\",\"" + val['idclienteprojeto'] + "\",\"" + val['codigo_auxiliar'] + "\",\"" + val['nome'] + "\");'>" + val['nome_projeto'] + "</a></li>";
                        });
                        $ul.html(html);
                        $ul.listview("refresh");
                        $ul.trigger("updatelayout");
                        
                    });
      }
    });
});



//############# DESPESA #####################################################
//###########################################################################
function upload(){
    var data = new FormData();
    var files = $('#arq_despesa')[0].files;
    data.append('arquivo', files[0]);
    
    $.ajax({
            type: 'POST',
            url: "upload.php",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
                success: function(data) {
                    $("#arquivo_md5").val(data);  
                },
                error: function(data){
                    alert("Ocorreu um erro ao enviar a foto selecionada.");
                }
        });
}

//Salva dados dA DESPESA
function salvar_despesa()
{
    var dados = new Object();
    
    dados['idvendedor']         = Objeto_json.usuario_id;
    dados['idvendedor_dig']     = $("#idvendedor_dig").val();
    dados['idempresa']          = Objeto_json.idempresa_vendedor;
    dados['idlctodespesa']      = $("#idlctodespesa").val();
    dados['idtabpreco']         = $("#idtabpreco").val();
    dados['data_lcto']          = $("#data_lcto").val();
    dados['idcliente']          = $("#idcliente_despesa").val();
    dados['idclienteprojeto']   = $("#idclienteprojeto_despesa").val();
    dados['idservicos']         = $("#codigo_despesa").val();
    dados['valor_despesa_digitado'] = $("#vlr_unitario").val();
    dados['qtde_despesa']       = $("#qtde_despesa").val();
    dados['valor_total']        = $("#valor_total").val();
    dados['local_despesa']      = $("#local_despesa").val();
    dados['num_despesa']        = $("#num_documento").val();
    dados['arq_despesa']        = $("#arq_despesa").val();

    dados['narrativa_principal'] = $("#narrativa_principal_despesa").val();
   
    arquivo_md5        = $("#arquivo_md5").val();
    
    var ajax_file = COMMON_URL_MOBILE + 'save_lanctos.php';
    
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            dados: dados,
            arquivo_md5: arquivo_md5,
            tipo: 'despesa',
            idsenha: Objeto_json.usuario_id
        }
    }).then(function(data) 
    { 
        if(data=='T'){
            $("#dateinput2").val($("#data_lcto").val());
            $('#dateinput2').trigger('change');         
            alert('Despesa salva com sucesso!');
            window.location.href = "#page8";
        }else{
            alert(data);
        }                  
    });   

}
//Buscar DESPESA conforme as datas
function buscar_despesa(data) {
    var ajax_file = COMMON_URL_MOBILE + '/busca_despesa.php';
    
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            data: data,
            idsenha: Objeto_json.usuario_id,
            idempresa_vendedor: Objeto_json.idempresa_vendedor
        }
    }).then(function(data) 
    { 
        $("#list_despesa").html(data); 
        $("#list_despesa").listview("refresh");                
    }); 
    
    

}


//Pega valores para editar despesa
$( document ).delegate( '#list_despesa .btn-despesa', 'click', function() { 
   idlctosdespesa = $(this).attr('id'); 
   
    var ajax_file = COMMON_URL_MOBILE + 'retorna_despesa.php';
    
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            idlctosdespesa: idlctosdespesa,
            tipo:'despesa'
        }
    }).then(function(data) 
    { 
        if(data.idlctodespesa!=''){
            $("#idlctodespesa").val(data.idlctodespesa);   
        }
        
        
        $("#idtabpreco").val(data.idtabpreco);  
        $("#data_lcto").val(data.data_lcto);       
        $("#vlr_unitario").val(data.valor_despesa_digitado); 
        $("#qtde_despesa").val(data.qtde_despesa);
        $("#valor_total").val(data.valor_total_digitado); 
        $("#local_despesa").val(data.local_despesa); 
        $("#num_documento").val(data.num_despesa);
        $("#narrativa_principal_despesa").val(data.narrativa_principal);
        $("#idcliente_despesa").val(data.idcliente);
        $('[placeholder="Busque o cliente...."]').val(data.nome_cliente);
        $("#idclienteprojeto_despesa").val(data.idclienteprojeto);
        $('[placeholder="Busque o projeto...."]').val(data.nome_projeto);
        if(data.id_arquivo){
            arquivo_edit = "<input type='hidden' name='idarquivo' id='idarquivo' value='"+data.id_arquivo+"' >";
            $("#upload_arquivos").html("<a href='javascript:;' onclick='deletaArquivo();' id='del_arquivo'>"+data.nome_arquivo+" X</a>"+arquivo_edit);
        }
        geraDespesa(data.idclienteprojeto,data.idservicos);               
    });     
    
});

//Deletar Arquivo
function deletaArquivo(){
    ok = confirm('Deseja realmente apagar esse arquivo?'); 
    if(ok==true){
        var ajax_file = COMMON_URL_MOBILE + 'arquivo_despesa.php';
        idarquivo = $("#idarquivo").val();
        
        $.post(ajax_file,{idarquivo: idarquivo,
                                tipo: 'deletar'},
            function(data)
            {  
                $("#arquivo_md5").val('');
                
            }, "text");
        $("#upload_arquivos").html('<input type="file" onchange="upload();" accept="image/*" name="arq_despesa" id="arq_despesa" >');
    }else{
        alert('Erro: Tente novamente');
    }
}

//Lista Serviços da Despesa
function geraDespesa(idclienteprojeto,selecionado){
    var ajax_file = COMMON_URL_MOBILE + 'retorna_despesa.php';
    
    
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            idclienteprojeto: idclienteprojeto,
            tipo:'despesaServico'
        }
    }).then(function(data) 
    { 
        
        var options = '<option value="">Selecione uma despesa</option>';
        
        $("#idtabpreco").val(data['idtabpreco']);
        
        jQuery.each(data.select, function(i, val) {
            selected = '';
            
            if(i==selecionado)
                selected = 'selected="selected"';

            options += '<option value="' + i + '" '+selected+'>' + val + '</option>';
            
        });


        $("#codigo_despesa").html(options);
        
        if(idclienteprojeto!=0){    
            $('#codigo_despesa option').each(function(){
                if($(this).val() == selecionado){
                    $('select#codigo_despesa').trigger('change');            
                }
            });   
        }
    }); 
    
}

//Calcula Total Despesa
function calcula_total_despesa(){
    vlr_total = $("#vlr_unitario").val()*$("#qtde_despesa").val();
    $("#valor_total").val(vlr_total);    
}

//Pega dados do  que foi clicado e deleta apaga
$( document ).delegate( '#list_despesa .delete_despesa', 'click', function() { 
   idlctodespesa = $(this).attr('id'); 
   if(confirm('Deseja excluir esta despesa?')){
        var ajax_file = COMMON_URL_MOBILE + 'save_lanctos.php';

    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            idlctodespesa: idlctodespesa,
            tipo:'despesa_excluir',
            idsenha: Objeto_json.usuario_id
        }
    }).then(function(data) 
    { 
        if(data=='T'){
            alert('Despesa inativada com sucesso.');
            $("#despesa_"+idlctodespesa).hide(500);
        }else{
            alert(data);
        }               
    }); 
           
   }
});

function selecionaValorDespesa(valor, tipo, id, id2, nome2)
{
    
    $(".ui-body-" + tipo).val(valor);

    if (tipo == 'c')
    {
        $("#idcliente_despesa").val(id);
        $("#idclienteprojeto_despesa").val('');
        $(".ui-body-p").val('');
    }
    else if (tipo == 'p')
    {
        $("#idclienteprojeto_despesa").val(id);
        
        if ($("#idcliente_despesa").val() == '')
        {
            geraDespesa(id,0);
            $("#idcliente_despesa").val(id2);
            $(".ui-body-c").val(nome2);
        }else{
            geraDespesa(id,0);
        }
    }
    

    $("ul").empty();
}

//################# FIM DESPESA ###############################################
//#############################################################################


//############# LISTA TIMESHEET ###############################################
//#############################################################################


//Buscar timesheet conforme as datas
function buscar_timesheet(data) {
    var ajax_file = COMMON_URL_MOBILE + 'busca_timesheet.php';
    
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            data: data,
            idsenha: Objeto_json.usuario_id,
            idempresa_vendedor: Objeto_json.idempresa_vendedor
        }
    }).then(function(data) 
    { 
        $("#list").html(data); 
        $( "#list" ).listview( "refresh" );            
    });    
    
}


//Pega dados do idtimecard que foi clicado na lista faz select e envia pra outra página
$( document ).delegate( '#list .btn-timesheet', 'click', function() { 
   idtimecard = $(this).attr('id'); 
    
    //var args = {cm: 'Timesheet->getTimecard', idtimecard: idtimecard};
    var ajax_file = COMMON_URL_MOBILE + 'retorna_timecard.php';
 
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            idtimecard: idtimecard
        }
    }).then(function(data) 
    { 
        codigo_atividade = data.idatividade_utbms;
         
        if(data.idtimecard!=''){
            $("#idtimecard").val(data.idtimecard);
        }
        changeCodigo(data.idcliente,data.idclienteprojeto,data.idtarefa_utbms,codigo_atividade);
        $("#data_trabalhada").val(data.data_trabalhada);
        $("#codigo_auxiliar").val(data.idcliente);
        $('[placeholder="Busque o cliente..."]').val(data.nome_cliente);
        $("#codigo").val(data.idclienteprojeto);
        $('[placeholder="Busque o projeto..."]').val(data.nome_projeto);
        hora_inicial = (data.dt_hr_inicial.substr(11,5));
        hora_final = (data.dt_hr_final.substr(11,5));
        $("#hora_inicial").val(hora_inicial);
        $("#hora_final").val(hora_final);
        $("#narrativa_principal").val(data.narrativa_principal);           
    });    
       
    
});

//Pega dados do idtimecard que foi clicado e deleta
$( document ).delegate( '#list .delete_timesheet', 'click', function() { 
   idtimecard = $(this).attr('id'); 
   if(confirm('Deseja apagar esse Timecard ?')){
        var ajax_file = COMMON_URL_MOBILE + 'save_lanctos.php';


    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            idtimecard: idtimecard,
            tipo:'timesheet_excluir',
            idsenha: Objeto_json.usuario_id
        }
    }).then(function(data) 
    { 
        if(data=='T'){
            alert('Timecard excluído com sucesso.');
            $("#timesheet_"+idtimecard).hide(500);
        }else{
            alert(data);
        }          
    });  
            
       
   }
});


//Exibe fase conforme idprojeto
    function changeCodigo(idcliente,idprojeto,selecionado_fase,selecionado_atividade){
        $.ajax({
            type: 'GET',
            url: COMMON_URL_MOBILE + 'search.php?tipo=t&idcliente='+idcliente+'&idprojeto='+idprojeto+'&idsenha='+Objeto_json.usuario_id,
            dataType: "jsonp",
            crossDomain: true
        })
        .then(function(response)
        {
            var options = '<option value="">Selecione uma fase</option>';
            
            $.each(response, function(key, val) {
                selected = '';
                if(val.idutbms==selecionado_fase)
                    selected = 'selected="selected"';
                options += '<option value="' + val.idutbms + '" '+selected+'>' + val.utbms_nome + '</option>';
            });

            $("#codigo_fase").html(options);
            
            $('#codigo_fase option').each(function(){
                if($(this).val() == selecionado_fase){
                    $('select#codigo_fase').trigger('change');            
                }
            });   
            
            if(selecionado_atividade!=0)
                seleciona_atividade(selecionado_atividade);
            
        });
    }
    
 function seleciona_atividade(selecionado)
{
    var options = '<option value="">Selecione uma atividade</option>';
    $("#codigo_atividade").html(options);
    val_idutbms_fase = $("#codigo_fase").val();
    idcliente = $("#codigo_auxiliar").val();
    idclienteprojeto = $("#codigo").val();

    if ($("#codigo_fase").val() != '')
    {
        $.ajax({
            type: 'GET',
            url: COMMON_URL_MOBILE + 'search.php?tipo=atividade&idtarefa=' + val_idutbms_fase+'&idsenha='+Objeto_json.usuario_id+'&idcliente='+idcliente+'&idprojeto='+idclienteprojeto,
            dataType: "jsonp",
            crossDomain: true
        })
                .then(function(response)
                {
                    var items = [];
                    var options = '<option value="">Escolha uma atividade</option>';

                    $.each(response, function(key, val) {
                        selected = '';
                        if(selecionado==val.idutbms){
                            selected = "selected='selected'";
                        }
                        options += '<option value="' + val.idutbms + '" '+selected+'>' + val.utbms_nome + '</option>';
                    });

                    $("#codigo_atividade").html(options);
                    
                    $('#codigo_atividade option').each(function(){
                        if($(this).val() == selecionado){
                            $('select#codigo_atividade').trigger('change');            
                        }
                    });                     
                });
    }
}



$(document).ready(function()
{

    $(document).on("pageinit", function()
    {
       verifica_logado();
      
    }); 
    
   
    $("#botao_entrar").click(function()
    {
        mobile_login();
    });

    $("#icon_sair").click(function()
    {
        mobile_logout();
    });

    $("#save_timecard_top").click(function()
    {
        salvar_timesheet();
    });

    $("#save_timecard_bottom").click(function()
    {
        salvar_timesheet();
    });
    
    $("#save_despesa_top").click(function()
    {
        salvar_despesa();
    });

    $("#save_despesa_bottom").click(function()
    {
        salvar_despesa();
    });    
    
    $("#filtro_data_trabalhada").change(function()
    {
       buscar_timesheet($("#filtro_data_trabalhada").val());
    });
    
    $("#dateinput2").change(function()
    {
       buscar_despesa($("#dateinput2").val());
    });    
    

    $("#codigo_fase").change(function ()
    {
        seleciona_atividade(0);
    }); 
    
    $("#vlr_unitario").blur(function ()
    {
        calcula_total_despesa();
    });   
    
    $("#qtde_despesa").blur(function ()
    {
        calcula_total_despesa();
    });      

    $("#novo_timecard_top").click(function ()
    {  
        clearInputs();
    });
    
    $("#novo_despesa_top").click(function ()
    {  
        clearInputs();
    });  
    
    var data = new Date();
    mes = data.getMonth()+1;
    
    if(mes<10)
        mes = "0"+mes;
    
    if(data.getDate()<10) 
        dia = "0"+data.getDate();
    else
        dia = data.getDate();
    
    data_hoje = data.getFullYear()+"-"+mes+"-"+dia;
    
    $("#icon_timesheet").click(function ()
    {  
        $('#filtro_data_trabalhada').val(data_hoje);
        $('#filtro_data_trabalhada').trigger('change');
    })    
    
    $("#icon_despesa").click(function ()
    {  
        $('#dateinput2').val(data_hoje);
        $('#dateinput2').trigger('change');
    })
});


