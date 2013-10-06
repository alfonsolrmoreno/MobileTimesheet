var COMMON_URL_MOBILE = 'http://www.multidadosti.com/fgv/mobile/';

function salvar_timesheet()
{
	var dados = new Object();
	dados['USUARIO_WS'] = 'multidados';
	dados['SENHA_WS'] = 'multi';
	dados['CNPJ_EMPRESA'] = '00.000.000/0000-00';
	dados['CODIGO_AUXILIAR_PREST'] = '0100';
	dados['DATA_LANCAMENTO'] = $("#data_trabalhada").val();
	dados['CODIGO_AUXILIAR_CLI'] = $("#codigo_auxiliar").val();
	dados['CODIGO_PROJETO'] = $("#codigo").val();
	dados['CODIGO_FASE'] = $("#utbms_fase").val();
	dados['COD_ATIVIDADE'] = $("#utbms_atividade").val();
	dados['HR_INICIO'] = $("#hora_inicial").val();
	dados['HR_FIM'] = $("#hora_final").val();
	dados['COBRAVEL_NAO_COBRAVEL'] = 'F';

	dados['NARRATIVA_PRINCIPAL'] = $("#narrativa_principal").val();
	acao = 'DadosTimesheet';
	operacao = 'cadastrar';
	
	var ajax_file = COMMON_URL_MOBILE+'client.php';
	
	/*
	$.post(ajax_file, {dados: dados ,acao:acao,operacao:operacao}, function(resposta)
	{
		if(resposta == 'T')
		{
			alert("Registro gravado com sucesso!");
		}
		else
		{
			alert(resposta);
		}
	});
	*/
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
		$( "#utbms_fase" ).val(id);
	}
	else if(tipo=='g')
	{
		$( "#utbms_atividade" ).val(id);
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
			idclienteprojeto = $( "#codigo" ).val();
			$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
			$ul.listview( "refresh" );
			$.ajax({
				type : 'GET',
				url: COMMON_URL_MOBILE+"search.php?tipo=c&codigo="+idclienteprojeto,
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
		var options = '<option value="">Escolha uma fase</option>';

		$.each(response, function (key, val) {
			
			options += '<option value="' + val.utbms + '">' + val.utbms_nome + '</option>';
		});
		
		$("#utbms_fase").html(options);		
	});

	$( "#utbms_fase" ).change(function()
	{
		var options = '<option value="">Escolha uma atividade</option>';
		$("#utbms_atividade").html(options);
		val_idutbms_fase = $( "#utbms_fase" ).val()
	    
		if($( "#utbms_fase" ).val()!='')
		{	
			$.ajax({
				type : 'GET',
				url: COMMON_URL_MOBILE+'search.php?tipo=g&idtarefa='+val_idutbms_fase,
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
				
				$("#utbms_atividade").html(options);
			});
	  }
	});
});