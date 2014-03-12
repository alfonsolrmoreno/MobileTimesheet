
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

//retirado do sugar_3.js, forms.js (utilizado em get_Form_lanctos,  ajax_funcs.js):
function unformatNumber(n, num_grp_sep, dec_sep)
{
    var x = unformatNumberNoParse(n, num_grp_sep, dec_sep);
    x = x.toString();

    if (x.length > 0)
    {
        return parseFloat(x);
    }
    return '';
}
//################# FORMATAR VALOR ############################################
VR_DECIMAIS = 2;
function unformatNumberNoParse(n, num_grp_sep, dec_sep)
{
    if (typeof num_grp_sep == 'undefined' || typeof dec_sep == 'undefined')
        return n;
    n = n.toString();

    if (n.length > 0)
    {
        n = n.replace(new RegExp(RegExp.escape(num_grp_sep), 'g'), '').replace(new RegExp(RegExp.escape(dec_sep)), '.');
        return n;
    }
    return '';
}
//retirado do sugar_3.js, forms.js (utilizado em get_Form_lanctos,  ajax_funcs.js):
RegExp.escape = function(text)
{
    if (!arguments.callee.sRE)
    {
        var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
        arguments.callee.sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    }
    return text.replace(arguments.callee.sRE, '\\$1');
}

function formatNumber(n,  dec_sep, round, precision)
{
    precision = Math.round(VR_DECIMAIS);

    if (typeof dec_sep == 'undefined')
        return n;
    n = n.toString();

    if (n.split)
        n = n.split('.');

    else
        return n;

    if (n.length > 2)
        return n.join('.');

    if (typeof round != 'undefined')
    {
        if (round > 0 && n.length > 1)
        {
            n[1] = parseFloat('0.' + n[1]);
            n[1] = Math.round(n[1] * Math.pow(10, round)) / Math.pow(10, round);
            n[1] = n[1].toString().split('.')[1];
        }

        if (round <= 0)
        {
            n[0] = Math.round(parseInt(n[0]) * Math.pow(10, round)) / Math.pow(10, round);
            n[1] = '';
        }
    }

    if (typeof precision != 'undefined' && precision >= 0)
    {
        if (n.length > 1 && typeof n[1] != 'undefined')
            n[1] = n[1].substring(0, precision);

        else
            n[1] = '';

        if (n[1].length < precision)
        {
            for (var wp = n[1].length; wp < precision; wp++)
                n[1] += '0';
        }
    }
    regex = /(\d+)(\d{3})/;

    return n[0] + (n.length > 1 && n[1] != '' ? dec_sep + n[1] : '');
}
//############# FIM FORMATAR VALOR ############################################


//############## INICIO LOGIN #################################################
//#############################################################################
function loading(showOrHide) {
    $.mobile.loading(showOrHide, {
	text: 'Carregando...',
	textVisible: true,
	theme: 'b'
    });
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
        loading('hide'); 
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
    }else{
        return 'ok';
    }
}

//####################### FIM LOGIN ###########################################
//#############################################################################


//######################## TIMESHEET ##########################################
//#############################################################################
//Salva dados do timesheet
function salvar_timesheet()
{
    loading('show');
    var dados = new Object();
    
    dados['idvendedor'] = Objeto_json.usuario_id;
    dados['idvendedor_dig']     = Objeto_json.usuario_id;
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
        loading('hide');
        if(data=='Timesheet salvo com sucesso.'){
            $("#filtro_data_trabalhada").val($("#data_trabalhada").val());
            $('#filtro_data_trabalhada').trigger('change');
            window.location.href = "#page_relatorio"; 
        }
        
    });
 
}

function selecionaValor(valor, tipo, id, id2, nome2)
{
    //$(".ui-body-" + tipo).val(valor);
    
    if (tipo == 'c')
    {
        $("#busca_cliente_timesheet").val(valor);
        $("#codigo_auxiliar").val(id);
        $("#codigo").val('');
        $("#busca_projeto_timesheet").val('');
    }
    else if (tipo == 'p')
    {
        
        $("#codigo").val(id);
        $("#busca_projeto_timesheet").val(valor);
        if ($("#codigo_auxiliar").val() == '')
        {
            $("#codigo_auxiliar").val(id2);
            //$(".ui-body-c").val(nome2);
            $("#busca_cliente_timesheet").val(nome2);
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
/*
$("#selecione_cliente").click(function ()
{  
    alert('f');
    $.ajax({
        type: 'GET',
        url: COMMON_URL_MOBILE + "search.php",
        dataType: "jsonp",
        crossDomain: true,
        data: {
            q: $input.val(),
            tipo: 'c',
            codigo: codigo_cliente
        }
    })
    .then(function(response) {
        $.each(response, function(i, val) {
            html += "<li><a href='javascript:selecionaValor(\"" + val['nome'] + "\",\"c\",\"" + val['idcliente'] + "\");'>" + val['nome'] + "</a></li>";
        });
        $("#page_timesheet_clientes").html(html);
        $("#page_timesheet_clientes").listview("refresh");
        $("#page_timesheet_clientes").trigger("updatelayout");
    });
});
*/
//#############################################################################
//######################## FIM TIMESHEET ######################################
//#############################################################################


//###### AUTO COMPLETE ######################################
/*
 * 
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
});*/



//############# DESPESA #####################################################
//###########################################################################
function upload(){
    var data = new FormData();
    var files = $('#arq_despesa')[0].files;
    data.append('arquivo', files[0]);
    loading('show');
    $.ajax({
            type: 'POST',
            url: 'http://www.multidadosti.com/teste_mobile/mobile/upload.php',
           
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            crossdomain: true
            })
            .then(function(data) {
                if(data=="Arquivo inválido!" || data=="Erro no arquivo"){
                    $("#arquivo_md5").val('');
                    alert(data);
                }else{
                    $("#arquivo_md5").val(data);
                }
                  
                //alert("Ocorreu um erro ao enviar a foto selecionada.");
                loading('hide');
        });
}

//Salva dados dA DESPESA
function salvar_despesa()
{
    var dados = new Object();
    loading('show');
    dados['idvendedor']         = Objeto_json.usuario_id;
    dados['idvendedor_dig']     = Objeto_json.usuario_id;
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
        loading('hide');
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

dados_servicos =new Object();

//Pega valores para editar despesa
$( document ).delegate( '#list_despesa .btn-despesa', 'click', function() { 
   idlctosdespesa = $(this).attr('id'); 
   loading('show');
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
        $("#valor_total").val(formatNumber(data.valor_total_digitado,'.',2,2)); 
        $("#local_despesa").val(data.local_despesa); 
        $("#num_documento").val(data.num_despesa);
        $("#narrativa_principal_despesa").val(data.narrativa_principal);
        $("#idcliente_despesa").val(data.idcliente);
        $('#busca_cliente_despesa').val(data.nome_cliente);
        $("#idclienteprojeto_despesa").val(data.idclienteprojeto);
        $('#busca_projeto_despesa').val(data.nome_projeto);
        if(data.id_arquivo){
            arquivo_edit = "<input type='hidden' name='idarquivo' id='idarquivo' value='"+data.id_arquivo+"' >";
            $("#upload_arquivos").html("<a href='javascript:;' onclick='deletaArquivo();' id='del_arquivo'>"+data.nome_arquivo+" X</a>"+arquivo_edit);
        }else{
            $("#arquivo_md5").val('');
            $("#upload_arquivos").html('<input type="file" onchange="upload();" accept="image/*" name="arq_despesa" id="arq_despesa" >');
        }
        geraDespesa(data.idclienteprojeto,data.idservicos);  
        loading('hide');
    });     
    
});



//Deletar Arquivo
function deletaArquivo(){
    ok = confirm('Deseja realmente apagar esse arquivo?'); 
    if(ok==true){
        var ajax_file = COMMON_URL_MOBILE + 'arquivo_despesa.php';
        idarquivo = $("#idarquivo").val();
        
        $.ajax({
            type: 'POST',
            url: ajax_file,
            dataType: "jsonp",
            crossDomain: true,
            data: {
                idarquivo: idarquivo,
                tipo: 'deletar'
            }
        }).then(function(data) 
        {        
            $("#arquivo_md5").val('');
        });
        $("#arquivo_md5").val('');
        $("#upload_arquivos").html('<input type="file" onchange="upload();" accept="image/*" name="arq_despesa" id="arq_despesa" >');
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
        //console.dir(data);
        dados_servicos = data.data;
        
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
    $("#valor_total").val(formatNumber(vlr_total, '.', 2, 2));    
}

//Pega dados do  que foi clicado e deleta apaga
$( document ).delegate( '#list_despesa .delete_despesa', 'click', function() { 
   idlctodespesa = $(this).attr('id'); 
   loading('show'); 
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
        loading('hide'); 
    }); 
           
   }
});

function selecionaValorDespesa(valor, tipo, id, id2, nome2)
{
    
    if (tipo == 'c')
    {
        $("#busca_cliente_despesa").val(valor);
        $("#idcliente_despesa").val(id);
        $("#idclienteprojeto_despesa").val('');
        $("#busca_projeto_despesa").val('');
    }
    else if (tipo == 'p')
    {
        $("#idclienteprojeto_despesa").val(id);
        $("#busca_projeto_despesa").val(valor);
        
        if ($("#idcliente_despesa").val() == '')
        {
            geraDespesa(id,0);
            $("#idcliente_despesa").val(id2);
            $("#busca_cliente_despesa").val(nome2);
        }else{
            geraDespesa(id,0);
        }
    }
    

    $("ul").empty();
}

//Lista clientes despesa
$( document ).delegate( '#page6 #selecione_cliente', 'click', function() { 
    $("#page_despesa_sub").hide();
    $("#save_despesa_top").hide();
    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_despesa_clientes').scrollPagination({
        nop     : 30, // The number of posts per scroll to be loaded
        offset  : 1, // Initial offset, begins at 0 in this case
        error   : '', // When the user reaches the end this is the message that is
                                    // displayed. You can change this if you want.
        delay   : 500, // When you scroll down the posts will load after a delayed amount of time.
                       // This is mainly for usability concerns. You can alter this as you see fit
        scroll  : true, // The main bit, if set to false posts will not load as the user scrolls. 
                       // but will still load if the user clicks.
        q       : $('#busca_cliente_despesa').val(),
        idempresa   : Objeto_json.idempresa_vendedor,
        idsenha   : Objeto_json.usuario_id,
        url     : COMMON_URL_MOBILE + 'search_teste.php',
        tipo    : 'c'
        
    });  
    $("#page6 #voltar_despesa").attr("href", "javascript:;");
    $( '#page6 #voltar_despesa').click(function()
    {
        $("#page_despesa_clientes").html('');
        $("#page_despesa_sub").show(function(){
            $("#page6 #voltar_despesa").attr("href", "#page8");
        });
    });
    
});

//pega click ao listar clientes despesa
$( document ).delegate( "#page6 [id^='idcliente_']", 'click', function() 
{
    $("#voltar_despesa").attr("href", "#page8");
    var id = $(this).attr('id');
    var idcliente = id.split('_');
    selecionaValorDespesa($(this).text(),"c",idcliente[1]);
    $("#page_despesa_clientes").html('');
    $("#page_despesa_sub").show();
});


//LISTA PROJETOS DESPESA
$( document ).delegate( '#page6 #selecione_projeto', 'click', function() { 
    $("#page_despesa_sub").hide();
    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_despesa_projetos').scrollPagination({
        nop     : 30, // The number of posts per scroll to be loaded
        offset  : 1, // Initial offset, begins at 0 in this case
        error   : '', // When the user reaches the end this is the message that is
                                    // displayed. You can change this if you want.
        delay   : 500, // When you scroll down the posts will load after a delayed amount of time.
                       // This is mainly for usability concerns. You can alter this as you see fit
        scroll  : true, // The main bit, if set to false posts will not load as the user scrolls. 
                       // but will still load if the user clicks.
        q       : $('#busca_projeto_despesa').val(),
        url     : COMMON_URL_MOBILE + 'search_teste.php',
        tipo    : 'p',
        idcliente   : $("#idcliente_despesa").val(),
        idempresa   : Objeto_json.idempresa_vendedor,
        idsenha   : Objeto_json.usuario_id
    });  
    $("#page6 #voltar_despesa").attr("href", "javascript:;");
    $( '#page6 #voltar_despesa').click(function()
    {
        $("#page_despesa_projetos").html('');
        $("#page_despesa_sub").show(function(){
            $("#page6 #voltar_despesa").attr("href", "#page8");
        });
    });    
});

//pega click ao listar projetos
$( document ).delegate( "[id^='idclienteprojeto_']", 'click', function() 
{
    $("#page6 #voltar_despesa").attr("href", "#page8");
    var id = $(this).attr('id');
    var idclienteprojeto = id.split('_');
    var idcliente = $(this).attr('data-idcliente');
    var nomecliente = $(this).attr('data-nomecliente');
    
    selecionaValorDespesa($(this).text(),"p",idclienteprojeto[1],idcliente,nomecliente);
    $("#page_despesa_projetos").html('');
    $("#page_despesa_sub").show();
});

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
    loading('show');
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
        $('#busca_cliente_timesheet').val(data.nome_cliente);
        $("#codigo").val(data.idclienteprojeto);
        $('#busca_projeto_timesheet').val(data.nome_projeto);
        hora_inicial = (data.dt_hr_inicial.substr(11,5));
        hora_final = (data.dt_hr_final.substr(11,5));
        $("#hora_inicial").val(hora_inicial);
        $("#hora_final").val(hora_final);
        $("#narrativa_principal").val(data.narrativa_principal);  
        loading('hide');
    });    
       
    
});

//Lista clientes no timesheet
$( document ).delegate( '#page_timesheet #selecione_cliente', 'click', function() { 
    $("#page_timesheet_sub").hide();
    $("#save_timesheet_top").hide();
    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_timesheet_clientes').scrollPagination({
        nop     : 30, // The number of posts per scroll to be loaded
        offset  : 1, // Initial offset, begins at 0 in this case
        error   : '...', // When the user reaches the end this is the message that is
                                    // displayed. You can change this if you want.
        delay   : 500, // When you scroll down the posts will load after a delayed amount of time.
                       // This is mainly for usability concerns. You can alter this as you see fit
        scroll  : true, // The main bit, if set to false posts will not load as the user scrolls. 
                       // but will still load if the user clicks.
        q       : $('#busca_cliente_timesheet').val(),
        url     : COMMON_URL_MOBILE + 'search_teste.php',
        tipo    : 'c',
        idempresa   : Objeto_json.idempresa_vendedor,
        idsenha   : Objeto_json.usuario_id
    }); 
    $("#page_timesheet #voltar_timesheet").attr("href", "javascript:;");
    $( '#page_timesheet #voltar_timesheet').click(function()
    {
        $("#page_timesheet_clientes").html('');
        $("#page_timesheet_sub").show(function(){
            $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
        });
    });      
});

//pega click ao listar clientes
$( document ).delegate( "[id^='idcliente_']", 'click', function() 
{
    var id = $(this).attr('id');
    var idcliente = id.split('_');
    selecionaValor($(this).text(),"c",idcliente[1]);
    $("#page_timesheet_clientes").html('');
    $("#page_timesheet_sub").show();
    $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
});

$( document ).delegate( '#page_timesheet #selecione_projeto', 'click', function() { 
    $("#page_timesheet_sub").hide();
    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_timesheet_projetos').scrollPagination({
        nop     : 30, // The number of posts per scroll to be loaded
        offset  : 1, // Initial offset, begins at 0 in this case
        error   : '...', // When the user reaches the end this is the message that is
                                    // displayed. You can change this if you want.
        delay   : 500, // When you scroll down the posts will load after a delayed amount of time.
                       // This is mainly for usability concerns. You can alter this as you see fit
        scroll  : true, // The main bit, if set to false posts will not load as the user scrolls. 
                       // but will still load if the user clicks.
        q       : $('#busca_projeto_timesheet').val(),
        url     : COMMON_URL_MOBILE + 'search_teste.php',
        tipo    : 'p',
        idcliente: $("#codigo_auxiliar").val(),
        idempresa   : Objeto_json.idempresa_vendedor,
        idsenha   : Objeto_json.usuario_id       
    });  
    $("#page_timesheet #voltar_timesheet").attr("href", "javascript:;");
    $( '#page_timesheet #voltar_timesheet').click(function()
    {
        $("#page_timesheet_projetos").html('');
        $("#page_timesheet_sub").show(function(){
            $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
        });
    });     
});

//pega click ao listar projetos
$( document ).delegate( "[id^='idclienteprojeto_']", 'click', function() 
{
    var id = $(this).attr('id');
    var idclienteprojeto = id.split('_');
    var idcliente = $(this).attr('data-idcliente');
    var nomecliente = $(this).attr('data-nomecliente');
    
    selecionaValor($(this).text(),"p",idclienteprojeto[1],idcliente,nomecliente);
    $("#page_timesheet_projetos").html('');
    $("#page_timesheet_sub").show();
    $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
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
       $resposta = verifica_logado();
      
    }); 
    $(document).on("pageinit","#page_login", function()
    {
       $resposta = verifica_logado();
       if($resposta == 'ok'){
           window.location.href = "#page_home";
       }
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
        if($("#vlr_unitario").val()!=''){
            if($("#qtde_despesa").val()==0 || $("#qtde_despesa").val()==''){
                $("#qtde_despesa").val(1);
            }
            calcula_total_despesa();        
            valor_unitario = $("#vlr_unitario").val();
            valor_unitario=formatNumber(valor_unitario, '.', 2, 2);
            $("#vlr_unitario").val(valor_unitario);
        }
    });   
    
    $("#qtde_despesa").blur(function ()
    {
        calcula_total_despesa();
    });      

    //Pega data do dia ########################################################
    var data = new Date();
    mes = data.getMonth()+1;
    
    if(mes<10)
        mes = "0"+mes;
    
    if(data.getDate()<10) 
        dia = "0"+data.getDate();
    else
        dia = data.getDate();
    
    data_hoje = data.getFullYear()+"-"+mes+"-"+dia;
    //#########################################################################

    $("#novo_timecard_top").click(function ()
    {  
        clearInputs();
        $("#data_trabalhada").val(data_hoje);
    });
    
    $("#novo_despesa_top").click(function ()
    {  
        clearInputs();
        $("#data_lcto").val(data_hoje);
    });  
    
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
    
  
    

       
    
    //DESPESA: pega dados do idserviço conforme selecionado
    $( "#codigo_despesa" ).change( function() { 
        idservico = $("#codigo_despesa option:selected").val(); 
        var ajax_file = COMMON_URL_MOBILE + 'retorna_despesa.php';
        dados_despesa = (dados_servicos[idservico]);
        
        var valor_despesa_digitado = formatNumber(dados_despesa['preco_venda'],'.',2,2);
        
        
	if(dados_despesa['valor_bloqueado_alt'] == 'T')
	{
            $('#vlr_unitario').val(valor_despesa_digitado);
            document.getElementById('vlr_unitario').style.backgroundColor = '#EAEAEA';
            document.getElementById('vlr_unitario').readOnly = true;
            $('#vlr_unitario').trigger('blur');
	}
	else
	{   
            if($('#vlr_unitario').val()==''){
                $('#vlr_unitario').val(valor_despesa_digitado);
            }
            document.getElementById('vlr_unitario').style.backgroundColor = '';
            document.getElementById('vlr_unitario').readOnly = false;
            $('#vlr_unitario').trigger('blur');
	}
    
    });
});



