//var pictureSource = navigator.camera.PictureSourceType;   // picture source
//var destinationType = navigator.camera.DestinationType; // sets the format of returned value

var retries = 0;

validateNotaVal();
//CP.jsv = Math.ceil(Math.random() * 999999999999999) + 1;
//$('head').append('<script' + ' type="text/javascript"' + ' src="' + CP.URL_APP + 'js/app.js?v=' + CP.jsv + '"' + '><' + '/' + 'script>');

function cam_clearCache() {
    navigator.camera.cleanup();
}

var sendpic_win = function(r) {
    loading('hide');
    window.setTimeout(function() {
        cam_clearCache();
        retries = 0;
        var sys_resp = eval('(' + r.response + ')');

        alert(sys_resp.msg);
    }, 100);
}

var sendpic_fail = function(error) {
    loading('hide');
    if (retries == 0) {
        retries++
        setTimeout(function() {
            onCapturePhoto(fileURI)
        }, 1000)
    } else {
        retries = 0;
        cam_clearCache();
        alert('Oops, algo de errado aconteceu!');
    }
}

function onCapturePhoto(fileURI) {

    var options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {
        cpsa: 'lancar_nota'
        , idnota: localStorage.getItem('lancando_nota_idnota')
        , idloja: $('#idloja').val()
        , valor: js_extract_numbers($('#nota_valor').val())
        , cents: js_extract_numbers($('#nota_valor_cents').val())
        , idestabelecimento: CP.idestabelecimento
        , idusuario: localStorage.getItem('usuario_idusuario')
        , idevento: localStorage.getItem('eventos_idevento')
    }; // if we need to send parameters to the server request

    var ft = new FileTransfer();
    loading('show', 'Enviando arquivo, aguarde...');

    ft.upload(fileURI, encodeURI(CP.URL_API), sendpic_win, sendpic_fail, options);
}

function capturePhoto(sourceType) {
    if (!sourceType)
        sourceType = Camera.PictureSourceType.CAMERA;

    if (!validateNotaVal())
        return false;

    navigator.camera.getPicture(onCapturePhoto, onFail, {
        //quality: 100,
        destinationType: destinationType.FILE_URI,
        quality: 90,
        //           destinationType:Camera.DestinationType.DATA_URL,
        targetWidth: 250,
        targetHeight: 250,
        saveToPhotoAlbum: true,
        sourceType: sourceType
    });
}

function onFail(message) {
    alert('Failed because: ' + message);
}

function validateNotaVal() {
    if (!$('#idloja').val()) {
        alert('Selecione a loja onde foi feita a compra');
        return false;
    }
    if (js_extract_numbers($('#nota_valor').val()) + js_extract_numbers($('#nota_valor_cents').val()) <= 0) {
        alert('Indique o valor da nota antes de tirar a foto ou fazer o envio da foto');
        return false;
    } else {
        return true;
    }
}