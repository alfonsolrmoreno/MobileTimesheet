var COMMON_URL_MOBILE = 'http://www.multidadosti.com/vmulti.mobile/mobile/';

function salvar_timesheet()
{
	var dados = new Object();

	alert('ssssssss');

	dados['USUARIO_WS'] 				= 'multidados';
	dados['SENHA_WS'] 					= 'multi';
	dados['CNPJ_EMPRESA'] 				= '00.000.000/0000-00';
	dados['CODIGO_AUXILIAR_PREST'] 		= '0100';
	dados['DATA_LANCAMENTO'] 			= $("#data_trabalhada").val();
	dados['CODIGO_AUXILIAR_CLI'] 		= $("#codigo_auxiliar").val();
	dados['CODIGO_PROJETO'] 			= $("#codigo").val();
	dados['CODIGO_FASE'] 				= $("#codigo_fase").val();
	dados['COD_ATIVIDADE'] 				= $("#codigo_atividade").val();
	dados['HR_INICIO'] 					= $("#hora_inicial").val();
	dados['HR_FIM'] 					= $("#hora_final").val();
	dados['COBRAVEL_NAO_COBRAVEL'] 		= 'F';

	dados['NARRATIVA_PRINCIPAL'] = $("#narrativa_principal").val();
	acao = 'DadosTimesheet';
	operacao = 'cadastrar';

	var ajax_file = COMMON_URL_MOBILE+'client.php';


	alert('zzazazazazazaza');

	$.ajax({
		type : 'POST',
		url: ajax_file,
		dataType: "jsonp",
		//dataType: "json", // quando for interno deve habilitar este e ocultar datatype e crossDomain
		crossDomain: true,
		data: {
				dados: dados,
				acao:acao,
				operacao:operacao
			}
	})
	.then( function ( response )
	{
		alert(response);
		if(response == 'T')
		{
			alert("Registro gravado com sucesso!");
		}
		else
		{
			alert(response);
		}
	});

}

function selecionaValor(valor,tipo,id,id2,nome2)
{
	$( ".ui-body-"+tipo ).val(valor);

	if(tipo == 'c')
	{
		$( "#codigo_auxiliar" ).val(id);
		$( "#codigo" ).val('');
		$( ".ui-body-p" ).val('');
	}
	else if(tipo=='p')
	{
		$( "#codigo" ).val(id);

		if($( "#codigo_auxiliar" ).val() == '')
		{
			$( "#codigo_auxiliar" ).val(id2);
			$( ".ui-body-c" ).val(nome2);
		}
	}
	else if(tipo=='t')
	{
		$( "#codigo_fase" ).val(id);
	}
	else if(tipo=='atividade')
	{
		$( "#codigo_atividade" ).val(id);
	}

	$("ul").empty();
}

$( document ).on( "pageinit", "#page_timesheet", function()
{
	$( "#autocomplete_cliente" ).on( "listviewbeforefilter", function ( e, data )
	{
		var $ul = $( this ),
			$input = $( data.input ),
			value = $input.val(),
			html = "";
		$ul.html( "" );

		if ( value && value.length > 2 )
		{
			codigo_cliente = $( "#codigo_cliente" ).val();

			$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
			$ul.listview( "refresh" );
			$.ajax({
				type : 'GET',
				url: COMMON_URL_MOBILE+"search.php?tipo=c&codigo="+codigo_cliente,
				dataType: "jsonp",
				//dataType: "json", // quando for interno deve habilitar este e ocultar datatype e crossDomain
				crossDomain: true,
				data: {
					q: $input.val()
				}
			})
			.then( function ( response ) {
				$.each( response, function ( i, val ) {
					html += "<li><a href='javascript:selecionaValor(\""+val['nome']+"\",\"c\",\""+val['codigo_auxiliar']+"\");'>" + val['nome'] + "</a></li>";
				});
				$ul.html( html );
				$ul.listview( "refresh" );
				$ul.trigger( "updatelayout");
			});
		}
	});

	$( "#autocomplete_projeto" ).on( "listviewbeforefilter", function ( e, data ) {
		var $ul = $( this ),
			$input = $( data.input ),
			value = $input.val(),
			html = "";
		$ul.html( "" );
		if ( value && value.length > 2 ) {
			codigo_auxiliar = $( "#codigo_auxiliar" ).val();
			$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
			$ul.listview( "refresh" );
			$.ajax({
				type : 'GET',
				url: COMMON_URL_MOBILE+"search.php?tipo=p&codigo_auxiliar="+codigo_auxiliar,
				dataType: "jsonp",
				//dataType: "json", // quando for interno deve habilitar este e ocultar datatype e crossDomain
				crossDomain: true,
				data: {
					q: $input.val()
				}
			})
			.then( function ( response ) {
				$.each( response, function ( i, val ) {
					html += "<li><a href='javascript:selecionaValor(\""+val['nome_projeto']+"\",\"p\",\""+val['codigo']+"\",\""+val['codigo_auxiliar']+"\",\""+val['nome']+"\");'>" + val['nome_projeto'] + "</a></li>";
				});
				$ul.html( html );
				$ul.listview( "refresh" );
				$ul.trigger( "updatelayout");
			});
		}
	});
});

$(document).ready(function ()
{
	$("#save_timecard_top").click(function()
	{
		salvar_timesheet();
	});

	$("#save_timecard_bottom").click(function()
	{
		salvar_timesheet();
	});

	$.ajax({
		type : 'GET',
		url: COMMON_URL_MOBILE+'search.php?tipo=t',
		dataType: "jsonp",
		//dataType: "json", // quando for interno deve habilitar este e ocultar datatype e crossDomain
		crossDomain: true
		/*,
		data: {
			q: $input.val()
		}*/
	})
	.then( function ( response )
	{
		var items = [];
		var options = '<option value="">Selecione uma fase</option>';

		$.each(response, function (key, val) {

			options += '<option value="' + val.utbms + '">' + val.utbms_nome + '</option>';
		});

		$("#codigo_fase").html(options);
	});

	$( "#codigo_fase" ).change(function()
	{
		var options = '<option value="">Selecione uma atividade</option>';
		$("#codigo_atividade").html(options);
		val_idutbms_fase = $( "#codigo_fase" ).val()

		if($( "#codigo_fase" ).val()!='')
		{
			$.ajax({
				type : 'GET',
				url: COMMON_URL_MOBILE+'search.php?tipo=atividade&idtarefa='+val_idutbms_fase,
				dataType: "jsonp",
				//dataType: "json", // quando for interno deve habilitar este e ocultar datatype e crossDomain
				crossDomain: true
				/*,
				data: {
					q: $input.val()
				}*/
			})
			.then( function ( response )
			{
				var items = [];
				var options = '<option value="">Escolha uma atividade</option>';

				$.each(response, function (key, val) {
					options += '<option value="' + val.idutbms + '">' + val.utbms_nome + '</option>';
				});

				$("#codigo_atividade").html(options);
			});
	  }
	});
});