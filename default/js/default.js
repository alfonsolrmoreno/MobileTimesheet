
var Objeto_real = localStorage['mobile_login'];
//localStorage.clear();
if (Objeto_real) {
    var Objeto_json = JSON.parse(Objeto_real)
    var COMMON_URL_MOBILE = Objeto_json.url + '/mobile/';
} else {
    if (typeof $("#url").val() != 'undefined') {
        var COMMON_URL_MOBILE = $("#url").val() + '/mobile/';
    } else {
        var COMMON_URL_MOBILE = '';
    }
}

pesq_autocomplete = '';

//Configuraç?o jquery.datebox
jQuery.extend(jQuery.mobile.datebox.prototype.options, {
    'overrideDateFormat': '%d/%m/%Y',
    'overrideHeaderFormat': '%d/%m/%Y',
    dateFieldOrder: ['d', 'm', 'y']
});
if (!supports_html5_storage) {
    alert("Infelizmente, seu navegador n?o suporta IndexedDB");
}

function clearInputs() {
    $(":input").each(function () {
        $(this).val('');
    });
    geraDespesa(0, 0);
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


//Data de dd/mm/yyyy para yyyy-mm-dd
function dateFormatDisplayToTimestamp(date) {
    if (date == "" || typeof date == "undefined")
        return "";
    if (date.indexOf(' ') != -1) {
        var data_hora = date.split(' ');
        var ex = data_hora[0].split("/");
        return ex[2] + "-" + ex[1] + "-" + ex[0] + " " + data_hora[1];
    } else {
        var ex = date.split("/");
        return ex[2] + "-" + ex[1] + "-" + ex[0];
    }
}

function dateFormatTimestampToDisplay(date, cfg) {
    if (date == "" || typeof date == "undefined")
        return "";
    if (date.indexOf(' ') != -1) {
        var data_hora = date.split(' ');
        if (cfg && cfg.strip_seconds) {
            var dh = data_hora[1].substring(0, 5);
        } else {
            var dh = data_hora[1];
        }

        if (data_hora[0].indexOf('-') != -1) {
            var ex = data_hora[0].split("-");
            var ret = ex[2] + "/" + ex[1] + "/" + ex[0] + " " + dh;
        } else {
            var ret = data_hora[0] + " " + dh;
        }

    } else {

        if (date.indexOf('-') != -1) {
            var ex = date.split("-");
            var ret = ex[2] + "/" + ex[1] + "/" + ex[0];
        } else {
            var ret = date;
        }
    }

    return ret;
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
RegExp.escape = function (text)
{
    if (!arguments.callee.sRE)
    {
        var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
        arguments.callee.sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    }
    return text.replace(arguments.callee.sRE, '\\$1');
}

function formatNumber(n, dec_sep, round, precision)
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
    dados['URL'] = $("#url").val();
    if (dados['URL'] != "") {
        var ajax_file_url = 'verifica_url.php';
        //Verifica se existe http:// e se existe "/" no final
        if ((dados['URL'].substr(0, 7)) != 'http://') {
            dados['URL'] = 'http://' + dados['URL'];
            if ((dados['URL'].substr(dados['URL'].length - 1, 1)) == '/') {
                dados['URL'] = dados['URL'].substr(0, dados['URL'].length - 1);
            }
        }

        //Remove "/login.php" caso enviado no campo URL
        if ((dados['URL'].substr(-10)) == '/login.php') {
            var count_url = dados['URL'].length;
            count_url = count_url - 10;
            dados['URL'] = dados['URL'].substr(0, count_url);
        }

        var ajax_file = dados['URL'] + '/mobile/login_mobile.php';
        COMMON_URL_MOBILE = dados['URL'] + '/mobile';
        //alert(COMMON_URL_MOBILE);
        $.ajax({
            type: 'POST',
            url: dados['URL'] + '/mobile/' + ajax_file_url,
            dataType: "jsonp",
            timeout: 10000,
            crossDomain: true,
            data: {
                url: COMMON_URL_MOBILE
            },
            error: function () {
                loading('hide');
                $().toastmessage('showErrorToast', 'Falha de comunica&ccedil;&atilde;o com o servidor. Verifique sua conex&atilde;o e se a URL est&aacute; correta');
            },
            success: function (data) {
                $.ajax({
                    type: 'POST',
                    url: ajax_file,
                    dataType: "jsonp",
                    timeout: 5000,
                    crossDomain: true,
                    data: {
                        usuario: dados['USUARIO'],
                        senha: dados['SENHA'],
                        url: dados['URL']
                    },
                    error: function () {
                        loading('hide');
                        $().toastmessage('showErrorToast', 'URL incorreta ou vers&atilde;o incompat&iacute;vel');
                        window.location.href = '#page_login';
                    },
                    success: function (data) {
                        if (data['erro']) {
                            loading('hide');
                            $().toastmessage('showErrorToast', data['erro']);
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
                    }
                });
            }
        });
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
    } else {

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
    dados['idvendedor_dig'] = Objeto_json.usuario_id;
    dados['idtimecard'] = $("#idtimecard").val();
    //dados['USUARIO_WS'] = Objeto_json.usuario_nome;
    //dados['SENHA_WS'] = Objeto_json.senha;
    //dados['CNPJ_EMPRESA'] = Objeto_json.cnpj;
    //dados['CODIGO_AUXILIAR_PREST'] = Objeto_json.codigo_auxiliar;
    dados['data'] = dateFormatDisplayToTimestamp($("#data_trabalhada").val());
    dados['idcliente'] = $("#codigo_auxiliar").val();
    dados['idclienteprojeto'] = $("#codigo").val();
    dados['hora'] = $("#hora_inicial").val();
    dados['hora_fim'] = $("#hora_final").val();
    dados['idtarefa_utbms'] = $("#codigo_fase").val();
    dados['idatividade_utbms'] = $("#codigo_atividade").val();
    dados['idtask_parent'] = $("#task_parent").val();
    dados['idtask'] = $("#task").val();
    dados['porc_conclusao_atividade'] = $("#porc_conclusao_atividade").val();
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
    }).then(function (data)
    {
        //alert(data);
        loading('hide');
        if (data == 'Timesheet salvo com sucesso') {
            $().toastmessage('showSuccessToast', data);
            $("#filtro_data_trabalhada").val($("#data_trabalhada").val());
            $('#filtro_data_trabalhada').trigger('change');
            $('#filtro_data_trabalhada').trigger('blur');
            window.location.href = "#page_relatorio";
        } else {
            $().toastmessage('showErrorToast', data);
        }

    });
}

function selecionaValor(valor, tipo, id, id2, nome2, tipo_projeto)
{
    //$(".ui-body-" + tipo).val(valor);

    if (tipo == 'c')
    {
        //$('#busca_cliente_timesheet').show();
        //$("#busca_cliente_timesheet").val(valor);
        $("#page_timesheet #selecione_cliente .ui-btn-text").text(valor);
        $("#codigo_auxiliar").val(id);
        $("#codigo").val('');
        $("#page_timesheet #selecione_projeto .ui-btn-text").text('Buscar Projeto');
    }
    else if (tipo == 'p')
    {

        $("#codigo").val(id);
        $("#page_timesheet #selecione_projeto .ui-btn-text").text(valor);
        //$('#busca_projeto_timesheet').show();
        //$("#busca_projeto_timesheet").val(valor);
        if ($("#codigo_auxiliar").val() == '')
        {
            $("#codigo_auxiliar").val(id2);
            //$(".ui-body-c").val(nome2);
            $("#page_timesheet #selecione_cliente .ui-btn-text").text(nome2);
            //$('#busca_cliente_timesheet').show();
            //$("#busca_cliente_timesheet").val(nome2);
            if (tipo_projeto == 'P') {
                seleciona_task_parent($("#codigo_auxiliar").val(), id, 0);
            } else {
                seleciona_fase($("#codigo_auxiliar").val(), id, 0, 0);
            }
        } else {
            if (tipo_projeto == 'P') {
                seleciona_task_parent($("#codigo_auxiliar").val(), id, 0);
            } else {
                seleciona_fase($("#codigo_auxiliar").val(), id, 0, 0);
            }
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




//############# DESPESA #####################################################
//###########################################################################
function upload() {
    var data = new FormData();
    var files = $('#arq_despesa')[0].files;
    data.append('arquivo', files[0]);
    loading('show');
    $.ajax({
        type: 'POST',
        url: COMMON_URL_MOBILE + 'upload.php',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        crossdomain: true
    })
            .then(function (data) {
                if (data == "Arquivo inválido!" || data == "Erro no arquivo") {
                    $("#arquivo_md5").val('');
                    $().toastmessage('showErrorToast', data);
                } else {
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
    dados['idvendedor'] = Objeto_json.usuario_id;
    dados['idvendedor_dig'] = Objeto_json.usuario_id;
    dados['idempresa'] = Objeto_json.idempresa_vendedor;
    dados['idlctodespesa'] = $("#idlctodespesa").val();
    dados['idtabpreco'] = $("#idtabpreco").val();
    dados['data_lcto'] = dateFormatDisplayToTimestamp($("#data_lcto").val());
    dados['idcliente'] = $("#idcliente_despesa").val();
    dados['idclienteprojeto'] = $("#idclienteprojeto_despesa").val();
    dados['idservicos'] = $("#codigo_despesa").val();
    dados['valor_despesa_digitado'] = $("#vlr_unitario").val();
    dados['qtde_despesa'] = $("#qtde_despesa").val();
    dados['valor_total'] = $("#valor_total").val();
    dados['local_despesa'] = $("#local_despesa").val();
    dados['num_despesa'] = $("#num_documento").val();
    dados['arq_despesa'] = $("#arq_despesa").val();
    dados['narrativa_principal'] = $("#narrativa_principal_despesa").val();
    arquivo_md5 = $("#arquivo_md5").val();
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
    }).then(function (data)
    {
        loading('hide');
        if (data == 'T') {
            $("#dateinput2").val($("#data_lcto").val());
            $('#dateinput2').trigger('change');
            $('#dateinput2').trigger('blur');
            $().toastmessage('showSuccessToast', 'Despesa salva com sucesso!');
            window.location.href = "#relatorio_despesa";
        } else {
            $().toastmessage('showErrorToast', data);
        }
    });
}
//Buscar DESPESA conforme as datas
function buscar_despesa(data) {
    var ajax_file = COMMON_URL_MOBILE + '/busca_despesa.php';
    loading('show');
    data = dateFormatDisplayToTimestamp(data);
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
    }).then(function (data)
    {
        $("#list_despesa").html(data);
        $("#list_despesa").listview("refresh");
        loading('hide');
    });
}

dados_servicos = new Object();
//Pega valores para editar despesa
$(document).delegate('#list_despesa .btn-despesa', 'click', function () {

    $(document).on("pageshow", "#page_despesa", function () { //Loading de página despesa
        loading('show');
    });
    idlctosdespesa = $(this).attr('id');
    var ajax_file = COMMON_URL_MOBILE + 'retorna_despesa.php';
    $.when(
            $.ajax({
                type: 'POST',
                url: ajax_file,
                dataType: "jsonp",
                crossDomain: true,
                async: false,
                afterSend: function () {
                    alert('antes?')
                },
                success: function (data) {
                    if (data.idlctodespesa != '') {
                        $("#idlctodespesa").val(data.idlctodespesa);
                    }

                    $("#idtabpreco").val(data.idtabpreco);
                    $("#data_lcto").val(dateFormatTimestampToDisplay(data.data_lcto));
                    $("#vlr_unitario").val(data.valor_despesa_digitado);
                    $("#qtde_despesa").val(data.qtde_despesa);
                    $("#valor_total").val(formatNumber(data.valor_total_digitado, '.', 2, 2));
                    $("#local_despesa").val(data.local_despesa);
                    $("#num_documento").val(data.num_despesa);
                    $("#narrativa_principal_despesa").val(data.narrativa_principal);
                    $("#idcliente_despesa").val(data.idcliente);
                    $("#page_despesa #selecione_cliente .ui-btn-text").text(data.nome_cliente);
                    $("#idclienteprojeto_despesa").val(data.idclienteprojeto);
                    $("#page_despesa #selecione_projeto .ui-btn-text").text(data.nome_projeto);
                    var COMMON_URL = COMMON_URL_MOBILE.substr(0, COMMON_URL_MOBILE.length - 7);
                    /*if (data.id_arquivo) {
                        arquivo_edit = "<input type='hidden' name='idarquivo' id='idarquivo' value='" + data.id_arquivo + "' >";
                        var filename = COMMON_URL_MOBILE + "open_files_mobile.php?ss=arq_despesas&id=" + data.id_arquivo + "&dw=F";
                        var markup = '<a href="#popupPhoto" data-rel="popup" data-position-to="window" data-role="button" data-inline="true" data-transition="fade">' + data.nome_arquivo + '</a>';
                        var popup = '<div data-role="popup" id="popupPhoto" data-overlay-theme="a" data-theme="d" data-corners="false"><a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a><img class="popphoto" src="' + filename + '" ></div>';
                        var apagar = '<a href="javascript:;" onclick="deletaArquivo();" id="del_arquivo" data-icon="delete"  data-role="button" data-iconpos="notext" data-inline="true" ></a>';
                        $("#popupPhoto").popup("destroy");
                        $("#upload_arquivos").empty().append('<div data-mini="true" data-role="controlgroup" data-type="horizontal">' + markup + apagar + '</div>' + arquivo_edit);
                        $("#popup_imagem").html(popup);
                        $("#page_despesa").trigger('create');
                        //$("#upload_arquivos").html("<a href='javascript:;' onclick='window.open(\""+COMMON_URL_MOBILE+"open_files_mobile.php?ss=arq_despesas&id="+data.id_arquivo+"&dw=F\")' id='del_arquivo'><img src='"+COMMON_URL_MOBILE+"open_files_mobile.php?ss=arq_despesas&id="+data.id_arquivo+"&dw=F' width='100px'></a>\n\
                        //   &nbsp;<button onclick='deletaArquivo();' data-mini=\"true\" id='del_arquivo' >Excluir</button>"+arquivo_edit);

                    } else {
                        $("#arquivo_md5").val('');
                        $("#upload_arquivos").html('<input type="file" onchange="upload();" accept="image/*" name="arq_despesa" id="arq_despesa" class="ui-input-text ui-body-c">');
                    }*/

                    if (data.id_arquivo) {
                        console.clear();
                        console.dir(data);
                        arquivo_edit = "<input type='hidden' name='idarquivo' id='idarquivo' value='" + data.id_arquivo + "' >";
                        var filename = COMMON_URL_MOBILE + "open_files_mobile.php?ss=arq_despesas&id=" + data.id_arquivo + "&dw=F";
                        var imagem = '<div><img width="25%" src="' + filename + '"></div>';
                        var apagar = '<a href="javascript:;" onclick="deletaArquivo();" id="del_arquivo" data-icon="delete"  data-role="button" data-iconpos="notext" data-inline="true" ></a>';
                        $("#popup_imagem").html('<br>'+ imagem + apagar + arquivo_edit);
                        $("#page_despesa").trigger('create');
                    }

                    geraDespesa(data.idclienteprojeto, data.idservicos);
                    $(document).on("pageshow", "#page_despesa", function () { //Loading de página despesa
                        loading('hide');
                    });
                },
                data: {
                    idlctosdespesa: idlctosdespesa,
                    tipo: 'despesa'
                }
            })).then(function () {

    });
});
$(document).on("pagecreate", function () {
    $(".photopopup").on({
        popupbeforeposition: function () {
            var maxHeight = $(window).height() - 60 + "px";
            $(".photopopup img").css("max-height", maxHeight);
        }
    });
});
//Deletar Arquivo
function deletaArquivo() {
    ok = confirm('Deseja realmente apagar esse arquivo?');
    if (ok == true) {
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
        }).then(function (data)
        {
            $("#arquivo_md5").val('');
        });
        $("#arquivo_md5").val('');
        $("#upload_arquivos").html('<input type="file" onchange="upload();" accept="image/*" name="arq_despesa" id="arq_despesa" class="ui-input-text ui-body-c">');
    }
}

//Lista Serviços da Despesa
function geraDespesa(idclienteprojeto, selecionado) {
    /*if (selecionado == 0 && idclienteprojeto == 0) {
     return false;
     }*/
    var ajax_file = COMMON_URL_MOBILE + 'retorna_despesa.php';
    if (selecionado == 0 || typeof selecionado == 'undefined') {
        selecionado = "";
        var selected_first = "selected='selected'";
    }
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            idclienteprojeto: idclienteprojeto,
            tipo: 'despesaServico'
        }
    }).then(function (data)
    {
        //console.dir(data);
        
        dados_servicos = data.data;
        var options = '<option value="" ' + selected_first + '>Selecione uma despesa</option>';
        $("#idtabpreco").val(data['idtabpreco']);
        jQuery.each(data.select, function (i, val) {
            selected = '';
            if (i == selecionado)
                selected = 'selected="selected"';
            options += '<option value="' + i + '" ' + selected + '>' + val + '</option>';
        });
        $("#codigo_despesa").html(options);
        loading('hide');
        $("#codigo_despesa").selectmenu("refresh");
    });
}

//Calcula Total Despesa
function calcula_total_despesa() {
    vlr_unitario = parseFloat($("#vlr_unitario").val().replace(',', '.'));
    vlr_total = vlr_unitario * $("#qtde_despesa").val();
    $("#valor_total").val(formatNumber(vlr_total, '.', 2, 2));
}

//Pega dados do  que foi clicado e deleta apaga
$(document).delegate('#list_despesa .delete_despesa', 'click', function () {
    idlctodespesa = $(this).attr('id');
    loading('show');
    if (confirm('Deseja excluir esta despesa?')) {
        var ajax_file = COMMON_URL_MOBILE + 'save_lanctos.php';
        $.ajax({
            type: 'POST',
            url: ajax_file,
            dataType: "jsonp",
            crossDomain: true,
            data: {
                idlctodespesa: idlctodespesa,
                tipo: 'despesa_excluir',
                idsenha: Objeto_json.usuario_id
            }
        }).then(function (data)
        {
            if (data == 'T') {
                $().toastmessage('showSuccessToast', 'Despesa inativada com sucesso!');
                $("#despesa_" + idlctodespesa).hide(500);
            } else {
                $().toastmessage('showErrorToast', data);
            }
            loading('hide');
        });
    }
});
function selecionaValorDespesa(valor, tipo, id, id2, nome2)
{

    if (tipo == 'c')
    {
        $("#page_despesa #selecione_cliente .ui-btn-text").text(valor);
        $("#idcliente_despesa").val(id);
        $("#idclienteprojeto_despesa").val('');
        $("#busca_projeto_despesa").val('');
    }
    else if (tipo == 'p')
    {
        $("#idclienteprojeto_despesa").val(id);
        $("#page_despesa #selecione_projeto .ui-btn-text").text(valor);
        if ($("#idcliente_despesa").val() == '')
        {
            geraDespesa(id, 0);
            $("#idcliente_despesa").val(id2);
            $("#page_despesa #selecione_cliente .ui-btn-text").text(nome2);
        } else {
            geraDespesa(id, 0);
        }
    }


    $("ul").empty();
}

//Lista clientes despesa
$(document).delegate('#page_despesa #selecione_cliente', 'click', function () {
    $("#page_despesa_sub").hide();
    $("#save_despesa_top").hide();

    pesq_autocomplete = 'c';
    $("#divautocomplete_despesa").show();
    $('input[data-type="search"]').val('');
    $('input[data-type="search"]').focus();

    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_despesa_clientes').scrollPagination({
        nop: 30, // The number of posts per scroll to be loaded
        offset: 1, // Initial offset, begins at 0 in this case
        error: '<center>Nenhum cliente encontrado</center>', // When the user reaches the end this is the message that is
        // displayed. You can change this if you want.
        delay: 500, // When you scroll down the posts will load after a delayed amount of time.
        // This is mainly for usability concerns. You can alter this as you see fit
        scroll: true, // The main bit, if set to false posts will not load as the user scrolls.
        // but will still load if the user clicks.
        q: $('#busca_cliente_despesa').val(),
        idempresa: Objeto_json.idempresa_vendedor,
        idsenha: Objeto_json.usuario_id,
        url: COMMON_URL_MOBILE + 'search.php',
        tipo: 'c'

    });
    $("#page_despesa #voltar_despesa").attr("href", "javascript:;");
    $('#page_despesa #voltar_despesa').click(function ()
    {
        $("#page_despesa_clientes").html('');
        $("#page_despesa_sub").show(function () {
            $("#page_despesa #voltar_despesa").attr("href", "#relatorio_despesa");
            $("#divautocomplete_despesa").hide();
        });
    });
});
//pega click ao listar clientes despesa
$(document).delegate("#page_despesa [id^='idcliente_']", 'click', function () {
//$("#page_despesa > [id^='idcliente_']").on('click', function() {
    $("#divautocomplete_despesa").hide();
    $("#voltar_despesa").attr("href", "#relatorio_despesa");
    var id = $(this).attr('id');
    var idcliente = id.split('_');
    selecionaValorDespesa($(this).text(), "c", idcliente[1]);
    $("#page_despesa_clientes").html('');
    $("#page_despesa_sub").show();
});
//LISTA PROJETOS DESPESA
$(document).delegate('#page_despesa #selecione_projeto', 'click', function () {
    pesq_autocomplete = 'p';
    $("#divautocomplete_despesa").show();
    $('input[data-type="search"]').val('');
    $('input[data-type="search"]').focus();

    $("#page_despesa_sub").hide();
    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_despesa_projetos').scrollPagination({
        nop: 30, // The number of posts per scroll to be loaded
        offset: 1, // Initial offset, begins at 0 in this case
        error: '<center>Nenhum projeto encontrado</center>', // When the user reaches the end this is the message that is
        // displayed. You can change this if you want.
        delay: 500, // When you scroll down the posts will load after a delayed amount of time.
        // This is mainly for usability concerns. You can alter this as you see fit
        scroll: true, // The main bit, if set to false posts will not load as the user scrolls.
        // but will still load if the user clicks.
        q: $('#busca_projeto_despesa').val(),
        url: COMMON_URL_MOBILE + 'search.php',
        tipo: 'p',
        idcliente: $("#idcliente_despesa").val(),
        idempresa: Objeto_json.idempresa_vendedor,
        idsenha: Objeto_json.usuario_id
    });
    $("#page_despesa #voltar_despesa").attr("href", "javascript:;");
    $('#page_despesa #voltar_despesa').click(function ()
    {
        $("#page_despesa_projetos").html('');
        $("#page_despesa_sub").show(function () {
            $("#page_despesa #voltar_despesa").attr("href", "#relatorio_despesa");
            $("#divautocomplete_despesa").hide();
        });
    });
});
//pega click ao listar projetos
$(document).delegate("[id^='idclienteprojeto_']", 'click', function () {
    $("#divautocomplete_despesa").hide();
    $("#page_despesa #voltar_despesa").attr("href", "#relatorio_despesa");
    var id = $(this).attr('id');
    var idclienteprojeto = id.split('_');
    var idcliente = $(this).attr('data-idcliente');
    var nomecliente = $(this).attr('data-nomecliente');
    selecionaValorDespesa($(this).text(), "p", idclienteprojeto[1], idcliente, nomecliente);
    $("#page_despesa_projetos").html('');
    $("#page_despesa_sub").show();
});

//################# FIM DESPESA ###############################################
//#############################################################################


//############# LISTA TIMESHEET ###############################################
//#############################################################################


//Buscar timesheet conforme as datas
function buscar_timesheet(data) {
    loading('show');
    data = dateFormatDisplayToTimestamp(data);
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
    }).then(function (data)
    {
        $("#list").html(data);
        $("#list").listview("refresh");
        loading('hide');
    });
}


//Editar: Pega dados do idtimecard que foi clicado na lista faz select e envia pra outra página
$(document).delegate('#list .btn-timesheet', 'click', function () {
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
    }).then(function (data)
    {
        loading('show');
        codigo_atividade = data.idatividade_utbms;
        if (data.idtimecard != '') {
            $("#idtimecard").val(data.idtimecard);
        }

        //Verifica se é project
        if (data.idtask != '') {
            $("#porcentagem_conclusao").show();
            seleciona_porcentagem_conclusao(data.porc_conclusao_atividade);
            //Andre Renovato - 24-06-2014
            //NOVO USANDO SELECTBOX
            $("#porc_conclusao_atividade").val();
            $("select#porc_conclusao_atividade").selectmenu("refresh");

            //ANTIGO USANDO SLIDER
            //$(".porc_conclusao_atividade").val(Math.round(data.porc_conclusao_atividade));
            //$('.porc_conclusao_atividade').slider('refresh');

            seleciona_task_parent(data.idcliente, data.idclienteprojeto, data.idtask);
        } else {
            $("#porcentagem_conclusao").hide();
            seleciona_fase(data.idcliente, data.idclienteprojeto, data.idtarefa_utbms, codigo_atividade);
        }
        $("#data_trabalhada").val(dateFormatTimestampToDisplay((data.data_trabalhada)));
        $("#codigo_auxiliar").val(data.idcliente);
        $("#page_timesheet #selecione_cliente .ui-btn-text").text(data.nome_cliente);
        $("#codigo").val(data.idclienteprojeto);
        $("#page_timesheet #selecione_projeto .ui-btn-text").text(data.nome_projeto);
        hora_inicial = (data.dt_hr_inicial.substr(11, 5));
        hora_final = (data.dt_hr_final.substr(11, 5));
        $("#hora_inicial").val(hora_inicial);
        $("#hora_final").val(hora_final);
        $("#narrativa_principal").val(data.narrativa_principal);
    });
});
//Lista clientes no timesheet
$(document).delegate('#page_timesheet #selecione_cliente', 'click', function () {
    pesq_autocomplete = 'c';
    $("#divautocomplete_timecard").show();
    $('input[data-type="search"]').val('');
    $('input[data-type="search"]').focus();

    $("#page_timesheet_sub").hide();
    $("#save_timesheet_top").hide();
    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_timesheet_clientes').scrollPagination({
        nop: 30, // The number of posts per scroll to be loaded
        offset: 1, // Initial offset, begins at 0 in this case
        error: '<center>Nenhum cliente encontrado</center>', // When the user reaches the end this is the message that is
        // displayed. You can change this if you want.
        delay: 500, // When you scroll down the posts will load after a delayed amount of time.
        // This is mainly for usability concerns. You can alter this as you see fit
        scroll: true, // The main bit, if set to false posts will not load as the user scrolls.
        // but will still load if the user clicks.
        q: $('#busca_cliente_timesheet').val(),
        url: COMMON_URL_MOBILE + 'search.php',
        tipo: 'c',
        idempresa: Objeto_json.idempresa_vendedor,
        idsenha: Objeto_json.usuario_id
    });
    $("#page_timesheet #voltar_timesheet").attr("href", "javascript:;");
    $('#page_timesheet #voltar_timesheet').click(function ()
    {
        $("#page_timesheet_clientes").html('');
        $("#page_timesheet_sub").show(function () {
            $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
            $("#divautocomplete_timecard").hide();
        });
    });
});
//pega click ao listar clientes
$(document).delegate("[id^='idcliente_']", 'click', function () {
    $("#divautocomplete_timecard").hide();
    var id = $(this).attr('id');
    var idcliente = id.split('_');
    selecionaValor($(this).text(), "c", idcliente[1]);
    $("#page_timesheet_clientes").html('');
    $("#page_timesheet_sub").show();
    $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
});
//Seleciona o projeto
$(document).delegate('#page_timesheet #selecione_projeto', 'click', function () {
    pesq_autocomplete = 'p';
    $("#divautocomplete_timecard").show();
    $('input[data-type="search"]').val('');
    $('input[data-type="search"]').focus();
    $("#page_timesheet_sub").hide();
    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_timesheet_projetos').scrollPagination({
        nop: 30, // The number of posts per scroll to be loaded
        offset: 1, // Initial offset, begins at 0 in this case
        error: '<center>Nenhum projeto encontrado</center>', // When the user reaches the end this is the message that is
        // displayed. You can change this if you want.
        delay: 500, // When you scroll down the posts will load after a delayed amount of time.
        // This is mainly for usability concerns. You can alter this as you see fit
        scroll: true, // The main bit, if set to false posts will not load as the user scrolls.
        // but will still load if the user clicks.
        q: $('#busca_projeto_timesheet').val(),
        url: COMMON_URL_MOBILE + 'search.php',
        tipo: 'p',
        idcliente: $("#codigo_auxiliar").val(),
        idempresa: Objeto_json.idempresa_vendedor,
        idsenha: Objeto_json.usuario_id
    });
    $("#page_timesheet #voltar_timesheet").attr("href", "javascript:;");
    $('#page_timesheet #voltar_timesheet').click(function ()
    {
        $("#page_timesheet_projetos").html('');
        $("#page_timesheet_sub").show(function () {
            $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
            $("#divautocomplete_timecard").hide();
        });
    });
});
//pega click ao listar projetos
$(document).delegate("[id^='idclienteprojeto_']", 'click', function () {
    $("#divautocomplete_timecard").hide();
    var id = $(this).attr('id');
    var idclienteprojeto = id.split('_');
    var idcliente = $(this).attr('data-idcliente');
    var nomecliente = $(this).attr('data-nomecliente');
    var lawps_utbms_project = $(this).attr('data-utbms-project');
    selecionaValor($(this).text(), "p", idclienteprojeto[1], idcliente, nomecliente, lawps_utbms_project);
    $("#page_timesheet_projetos").html('');
    $("#page_timesheet_sub").show();
    $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
    if (lawps_utbms_project == 'P') {
        $("#porcentagem_conclusao").show();
        //carrega lista com porcentagens
        seleciona_porcentagem_conclusao();
    } else {
        $("#porcentagem_conclusao").hide();
    }
});

//Pega dados do idtimecard que foi clicado e deleta
$(document).delegate('#list .delete_timesheet', 'click', function () {
    idtimecard = $(this).attr('id');
    if (confirm('Deseja apagar esse Timecard ?')) {
        var ajax_file = COMMON_URL_MOBILE + 'save_lanctos.php';
        $.ajax({
            type: 'POST',
            url: ajax_file,
            dataType: "jsonp",
            crossDomain: true,
            data: {
                idtimecard: idtimecard,
                tipo: 'timesheet_excluir',
                idsenha: Objeto_json.usuario_id
            }
        }).then(function (data)
        {
            if (data == 'T') {
                $().toastmessage('showSuccessToast', 'Timecard exclu&iacute;do com sucesso!');
                $("#timesheet_" + idtimecard).hide(500);
            } else {
                $().toastmessage('showErrorToast', data);
            }
        });
    }
});
//Exibe fase conforme idprojeto
function seleciona_fase(idcliente, idprojeto, selecionado_fase, selecionado_atividade) {
    loading('show');
    if ($("input#codigo_fase").attr('type') == 'hidden') {
        $("input#codigo_fase").remove();
        $("input#codigo_atividade").remove();
    }

    $("#task_parent").attr('id', 'codigo_fase');
    $("#codigo_fase").attr('name', 'codigo_fase');
    $("#task").attr('id', 'codigo_atividade');
    $("#codigo_atividade").attr('name', 'codigo_atividade');
    $.ajax({
        type: 'GET',
        url: COMMON_URL_MOBILE + 'search.php?tipo=t&idcliente=' + idcliente + '&idprojeto=' + idprojeto + '&idsenha=' + Objeto_json.usuario_id,
        dataType: "jsonp",
        crossDomain: true
    })
            .then(function (response)
            {
                if (selecionado_fase == 0 || typeof selecionado_fase == 'undefined') {
                    selecionado_fase = "";
                    var selected_first = "selected='selected'";
                }
                var options = '<option value="" ' + selected_first + '>Selecione uma fase</option>';
                $.each(response, function (key, val) {
                    selected = '';
                    if (val.idutbms == selecionado_fase)
                        selected = 'selected="selected"';
                    options += '<option value="' + val.idutbms + '" ' + selected + '>' + val.utbms_nome + '</option>';
                });
                $("#codigo_fase").html(options);
                $("select#codigo_fase").selectmenu("refresh");
                loading('hide');
                if (selecionado_atividade != 0)
                    seleciona_atividade(selecionado_atividade);
            });
}

//Andre Renovato - 26/06/2014 - oc:13190
//Exibe lista de porcentagem conclusao
function seleciona_porcentagem_conclusao(item_selected) {
    loading('show');

    $.ajax({
        type: 'GET',
        url: COMMON_URL_MOBILE + 'search.php?tipo=percent_conclusao',
        dataType: "jsonp",
        crossDomain: true
    })

            .then(function (response) {
                var options = '';
                $.each(response, function (key, val) {
                    selected = item_selected ? item_selected : '';

                    selected = val == selected ? 'selected="selected"' : '';

                    options += '<option value="' + val + '" ' + selected + '>' + val + '</option>';
                });

                $("#porc_conclusao_atividade").html(options);
                $("select#porc_conclusao_atividade").selectmenu("refresh");
                loading('hide');
            });
}



function seleciona_atividade(selecionado)
{
    loading('show');
    if (selecionado == 0 || typeof selecionado == 'undefined') {
        selecionado = "";
        var selected_first = "selected='selected'";
    }
    var options = '<option value="" ' + selected_first + '>Selecione uma atividade</option>';
    $("#codigo_atividade").html(options);
    val_idutbms_fase = $("#codigo_fase").val();
    idcliente = $("#codigo_auxiliar").val();
    idclienteprojeto = $("#codigo").val();
    if ($("#codigo_fase").val() != '')
    {
        $.ajax({
            type: 'GET',
            url: COMMON_URL_MOBILE + 'search.php?tipo=atividade&idtarefa=' + val_idutbms_fase + '&idsenha=' + Objeto_json.usuario_id + '&idcliente=' + idcliente + '&idprojeto=' + idclienteprojeto,
            dataType: "jsonp",
            crossDomain: true
        })
                .then(function (response)
                {
                    var items = [];
                    var options = '<option value="">Escolha uma atividade</option>';
                    $.each(response, function (key, val) {
                        selected = '';
                        if (selecionado == val.idutbms) {
                            selected = "selected='selected'";
                        }
                        options += '<option value="' + val.idutbms + '" ' + selected + '>' + val.utbms_nome + '</option>';
                    });
                    $("#codigo_atividade").html(options);
                    $("select#codigo_atividade").selectmenu("refresh");
                    loading('hide');
                });
    }
}

//Exibe TAREFA PRINCIPAL conforme idprojeto se for PROJECT
function seleciona_task_parent(idcliente, idprojeto, selecionado) {

    loading('show');
    $.ajax({
        type: 'GET',
        url: COMMON_URL_MOBILE + 'search.php?tipo=task_parent&idcliente=' + idcliente + '&idprojeto=' + idprojeto + '&idsenha=' + Objeto_json.usuario_id + '&idempresa=' + Objeto_json.idempresa_vendedor + '&idtask=' + selecionado,
        dataType: "jsonp",
        crossDomain: true
    })
            .then(function (response)
            {
                selecionado_parent = response.selecionado;

                if ((typeof selecionado == 'undefined' || selecionado == '') && selecionado_parent != '')
                    selecionado = selecionado_parent;

                if (selecionado_parent == 0 || typeof selecionado_parent == 'undefined') {
                    selecionado_parent = "";
                    var selected_first = "selected='selected'";
                }
                var options = '<option value="" ' + selected_first + ' >Selecione uma tarefa</option>';
                $.each(response.select_tarefas, function (key, val) {
                    selected = '';
                    if (selecionado_parent == key) {
                        selected = "selected='selected'";
                    }
                    options += '<option value="' + key + '" ' + selected + '>' + val + '</option>';
                });
                //$('#atividade_task').html(response.select_atividades);
                if (!$("#task_parent").length) {
                    $("#codigo_fase").attr("id", "task_parent");
                    $("#task_parent").attr("name", "task_parent");
                }
                $("#task_parent").html(options);
                if ($("input#codigo_fase").attr('type') != 'hidden') {
                    $('#fase_task').append('<input type="hidden" name="codigo_fase" id="codigo_fase" >');
                }
                $('#codigo_fase').val(response.select_tarefas_hidden);
                $("select#task_parent").selectmenu("refresh");
                loading('hide');

                if (selecionado != '')
                    seleciona_task(idcliente, idprojeto, selecionado_parent, selecionado);
            });
}

//Exibe TAREFA FILHO conforme idprojeto se for PROJECT
function seleciona_task(idcliente, idprojeto, idtarefa_principal, selecionado) {
    loading('show');
    $.ajax({
        type: 'GET',
        url: COMMON_URL_MOBILE + 'search.php?tipo=task&idcliente=' + idcliente + '&idprojeto=' + idprojeto + '&idsenha=' + Objeto_json.usuario_id + '&idempresa=' + Objeto_json.idempresa_vendedor + '&idtarefa_principal=' + idtarefa_principal,
        dataType: "jsonp",
        crossDomain: true
    })
            .then(function (response)
            {
                if (selecionado == 0 || typeof selecionado == 'undefined') {
                    selecionado = "";
                    var selected_first = "selected='selected'";
                }
                var options = '<option value="" ' + selected_first + '>Selecione uma atividade</option>';
                $.each(response.select_atividades, function (key, val) {
                    selected = '';
                    if (selecionado == key) {
                        selected = "selected='selected'";
                    }
                    options += '<option value="' + key + '" ' + selected + '>' + val + '</option>';
                });
                //$('#atividade_task').html(response.select_atividades);
                if (!$("#task").length) {
                    $("#codigo_atividade").attr("id", "task");
                    $("#task").attr("name", "task");
                }
                $("#task").html(options);
                if ($("input#codigo_atividade").attr('type') != 'hidden') {
                    $('#atividade_task').append('<input type="hidden" name="codigo_atividade" id="codigo_atividade" >');
                }
                $('#codigo_atividade').val(response.select_atividades_hidden);
                $("select#task").selectmenu("refresh");
                loading('hide');
            });
}




$(document).delegate('#task_parent', 'change', function () {
    seleciona_task($('#codigo_auxiliar').val(), $('#codigo').val(), $('#task_parent').val());
});
$(document).on("pageinit", "#page_login", function ()
{
    $resposta = verifica_logado();
    if ($resposta == 'ok') {
        window.location.href = "#page_home";
    }
});
$(document).ready(function () {

    //Pega data do dia ########################################################
    var data = new Date();
    mes = data.getMonth() + 1;
    if (mes < 10)
        mes = "0" + mes;
    if (data.getDate() < 10)
        dia = "0" + data.getDate();
    else
        dia = data.getDate();
    data_hoje = dia + "/" + mes + "/" + data.getFullYear();
    //#########################################################################

    //Configuraç?o alert
    $().toastmessage({
        position: 'middle-center',
        type: 'success'
    });
    //Define footer para todas as páginas
    $(".name_powered").html('Powered by MultidadosTI &copy;<br /> v.2.0.6');
    $(document).on("pageinit", function ()
    {
        $resposta = verifica_logado();
        $("#data_lcto").val(data_hoje);
        $("#data_trabalhada").val(data_hoje);
        if ($("#filtro_data_trabalhada").val() == '') {
            $("#filtro_data_trabalhada").val(data_hoje);
        }
        if ($("#dateinput2").val() == '') {
            $("#dateinput2").val(data_hoje);
        }
    });
    $("#botao_entrar").click(function ()
    {
        mobile_login();
    });
    $("#icon_sair").click(function ()
    {
        mobile_logout();
    });
    $("#save_timecard_top").click(function ()
    {
        salvar_timesheet();
    });
    $("#save_timecard_bottom").click(function ()
    {
        salvar_timesheet();
    });
    $("#save_despesa_top").click(function ()
    {
        salvar_despesa();
    });
    $("#save_despesa_bottom").click(function ()
    {
        salvar_despesa();
    });
    ua = navigator.userAgent.toLowerCase();
    //verifica se é ios
    if (ua.indexOf('iphone') != -1 || ua.indexOf('ipod') != -1) {
        $("#filtro_data_trabalhada").change(function ()
        {
            buscar_timesheet($("#filtro_data_trabalhada").val());
        });
    } else {
        $("#filtro_data_trabalhada").change(function ()
        {
            buscar_timesheet($("#filtro_data_trabalhada").val());
        });
        
        /*if (ua.indexOf('android') != -1) {
            var version = ua.match(/android\s+([\d\.]+)/)[1];
            //Se vers?o android for maior 4.3 desabilita upload despesa
            if (parseFloat(version) == 4.3) {
                $('#upload_despesa').hide();
            }
        }*/
    }

    if (ua.indexOf('iphone') != -1 || ua.indexOf('ipod') != -1 || ua.indexOf('ipad') != -1) {

        /*
         $(".pagina").css("margin-top", "20px");
         $("#barra_status_ios").css("position", "fixed");
         $("#barra_status_ios").css("z-index", "99");
         $("#barra_status_ios").css("top", "0%");
         $("#barra_status_ios").css("height", "20px");
         $("#barra_status_ios").css("width", "100%");
         $("#barra_status_ios").css("background", "#EAEAEA");
         */

        $("#dateinput2").change(function ()
        {
            buscar_despesa($("#dateinput2").val());
        });
    } else {
        $("#dateinput2").change(function ()
        {
            buscar_despesa($("#dateinput2").val());
        });
    }

    $(document).delegate('#codigo_fase', 'change', function () {
        seleciona_atividade(0);
    });
    $("#vlr_unitario").blur(function ()
    {
        if ($("#vlr_unitario").val() != '') {
            if ($("#qtde_despesa").val() == 0 || $("#qtde_despesa").val() == '') {
                $("#qtde_despesa").val(1);
            }
            calcula_total_despesa();
            valor_unitario = parseFloat($("#vlr_unitario").val().replace(',', '.'));
            $("#vlr_unitario").val(valor_unitario);
        }
    });
    $("#qtde_despesa").blur(function ()
    {
        calcula_total_despesa();
    });
    $("#novo_timecard_top").click(function ()
    {
        clearInputs();
        $("#page_timesheet #selecione_cliente .ui-btn-text").text('Buscar Cliente');
        $("#page_timesheet #selecione_projeto .ui-btn-text").text('Buscar Projeto');
        $("#data_trabalhada").val(data_hoje);
    });
    $("#novo_despesa_top").click(function ()
    {
        clearInputs();
        $("#arquivo_md5").val('');
        $("#upload_arquivos").html('<input type="file" onchange="upload();" accept="image/*" name="arq_despesa" id="arq_despesa" class="ui-input-text ui-body-c">');
        $(document).on("pageshow", "#page_despesa", function () { //Loading de página despesa
            loading('hide');
        });
        $("#page_despesa #selecione_cliente .ui-btn-text").text('Buscar Cliente');
        $("#page_despesa #selecione_projeto .ui-btn-text").text('Buscar Projeto');
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
    $("#codigo_despesa").change(function () {
        idservico = $("#codigo_despesa option:selected").val();
        var ajax_file = COMMON_URL_MOBILE + 'retorna_despesa.php';
        dados_despesa = (dados_servicos[idservico]);
        var valor_despesa_digitado = formatNumber(dados_despesa['preco_venda'], '.', 2, 2);
        if (dados_despesa['valor_bloqueado_alt'] == 'T') {
            $('#vlr_unitario').val(valor_despesa_digitado);
            document.getElementById('vlr_unitario').style.backgroundColor = '#EAEAEA';
            document.getElementById('vlr_unitario').readOnly = true;
            $('#vlr_unitario').trigger('blur');
        } else {
            if ($('#vlr_unitario').val() == '') {
                $('#vlr_unitario').val(valor_despesa_digitado);
            }
            document.getElementById('vlr_unitario').style.backgroundColor = '';
            document.getElementById('vlr_unitario').readOnly = false;
            $('#vlr_unitario').trigger('blur');
        }

    });

    $("#divautocomplete_timecard").hide();
    $("#divautocomplete_despesa").hide();
    //ajax de pesquisa cliente/projeto
    $(document).on("pageinit", "#page_despesa", function () {
        $("#autocomplete_cli").on("listviewbeforefilter", function (e, data) {
            var $ul = $(this),
                    $input = $(data.input),
                    value = $input.val(),
                    html = "";
            $ul.html("");
            if (value && value.length > 0) {
                $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
                $ul.listview("refresh");
                $.ajax({
                    //url: "http://gd.geobytes.com/AutoCompleteCity",
                    url: COMMON_URL_MOBILE + 'search.php',
                    dataType: "jsonp",
                    crossDomain: true,
                    data: {
                        q: $input.val(),
                        idempresa: Objeto_json.idempresa_vendedor,
                        idsenha: Objeto_json.usuario_id,
                        offset: 1, // Initial offset, begins at 0 in this case
                        tipo: pesq_autocomplete, //pesq_autocomplete é uma variavel global onde seto qual tipo de pesquisa, neste caso cliente ou projeto
                        mode: 'ajax'
                    }
                })
                        .then(function (response) {
                            $("#page_despesa_clientes").html('');
                            $("#page_despesa_projetos").html('');
                            $ul.html(response);
                            $ul.listview("refresh");
                            $ul.trigger("updatelayout");
                        });
            }
        });
    });
    $(document).on("pageinit", "#page_timesheet", function () {
        $("#autocomplete_prj").on("listviewbeforefilter", function (e, data) {
            var $ul = $(this),
                    $input = $(data.input),
                    value = $input.val(),
                    html = "";
            $ul.html("");
            if (value && value.length > 0) {
                $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
                $ul.listview("refresh");
                $.ajax({
                    //url: "http://gd.geobytes.com/AutoCompleteCity",
                    url: COMMON_URL_MOBILE + 'search.php',
                    dataType: "jsonp",
                    crossDomain: true,
                    data: {
                        q: $input.val(),
                        idempresa: Objeto_json.idempresa_vendedor,
                        idsenha: Objeto_json.usuario_id,
                        offset: 1, // Initial offset, begins at 0 in this case
                        tipo: pesq_autocomplete, //pesq_autocomplete é uma variavel global onde seto qual tipo de pesquisa, neste caso cliente ou projeto
                        mode: 'ajax'
                    }
                })
                        .then(function (response) {
                            $("#page_timesheet_clientes").html('');
                            $("#page_timesheet_projetos").html('');
                            $ul.html(response);
                            $ul.listview("refresh");
                            $ul.trigger("updatelayout");
                        });
            }
        });
    });

    //Verifica se existe user logado
    if (Objeto_json.usuario_id) {
        //Inclui js manipula upload camera. Incluimos um get randomico para n?o correr o risco do arquivo n?o ser instanciado
        var rand = Math.ceil(Math.random() * 999999999999999) + 1;
        var x = COMMON_URL_MOBILE + 'js/upload-despesa.js?v=' + rand;
        var scriptAppend = '<script type="text/javascript" src="' + x + '"></script>';
        $('head').append(scriptAppend);
    }
    
    //default div bot?es upload fechados
    $("#optionsUpload").hide()
    $("#uploadArquivo").click(function() {
        $("#optionsUpload").toggle();
        $("#btn_save_despesa").toggle();
     });
     $("#cancel_upload").click(function() {
        $("#optionsUpload").toggle();
        $("#btn_save_despesa").toggle();
     }); 
    
});