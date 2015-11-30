//versao do mobile para mostrar no footer
var vs_mobile = 'v.3.0.0';
var debug_mode = false;
var debug_js_errors = false;

var Objeto_real = localStorage['mobile_login'];

var arrayDia = new construirArray(7);
arrayDia[0] = "Domingo";
arrayDia[1] = "Segunda-Feira";
arrayDia[2] = "Ter&ccedil;a-Feira";
arrayDia[3] = "Quarta-Feira";
arrayDia[4] = "Quinta-Feira";
arrayDia[5] = "Sexta-Feira";
arrayDia[6] = "Sabado";

var arrayMes = new construirArray(12);
arrayMes[0] = "Janeiro";
arrayMes[1] = "Fevereiro";
arrayMes[2] = "Mar&ccedil;o";
arrayMes[3] = "Abril";
arrayMes[4] = "Maio";
arrayMes[5] = "Junho";
arrayMes[6] = "Julho";
arrayMes[7] = "Agosto";
arrayMes[8] = "Setembro";
arrayMes[9] = "Outubro";
arrayMes[10] = "Novembro";
arrayMes[11] = "Dezembro";



    //Verifica se existe user logado    
    if (!objIsEmpty(Objeto_json)) {
        //Inclui js manipula upload camera. Incluimos um get randomico para n?o correr o risco do arquivo n?o ser instanciado
        var rand = Math.ceil(Math.random() * 999999999999999) + 1;
        var x = COMMON_URL_MOBILE + '/js/upload-despesa.js?v=' + rand;
        var scriptAppend = '<script type="text/javascript" src="' + x + '"></script>';
        $('head').append(scriptAppend);
    }
    
ready