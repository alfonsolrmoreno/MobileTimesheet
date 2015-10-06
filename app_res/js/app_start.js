CP = {online: true};
CP.APP_NAME = 'multidados';
CP.VERSION = '0.0.5';
CP.jsv = Math.ceil(Math.random() * 999999999999999) + 1;

MSG_SEM_NET = "Este aplicativo precisa de internet. Por favor verifique sua conexão e tente de novo.";

if (window.location.href.indexOf('desktop=on') !== -1) {
    localStorage.setItem('destktop_version', 1);
} else if (window.location.href.indexOf('desktop=off') !== -1) {
    localStorage.removeItem('destktop_version');
}
if (localStorage.getItem('destktop_version') != 1) {
    CP.URL_APP = 'http://apph.multidadosti.com.br/2015.11/mobile/';
} else {
    CP.URL_APP = 'http://' + window.location.host + '/m_apps/queropizzaw/';
}


function nalert(message, title, buttonName, alertCallback) {
    if (!title)
        title = '';

    if (!buttonName)
        buttonName = 'OK';

    if (typeof navigator == 'undefined' ||
            typeof navigator.notification == 'undefined' ||
            typeof navigator.notification.alert != 'function') {
        alert(message);
    } else {
        navigator.notification.alert(message, alertCallback, title, buttonName)
    }
}

function splash_show() {
    if (typeof navigator.splashscreen == 'object') {
        navigator.splashscreen.show();
    }
}

function splash_hide() {
    if (typeof navigator.splashscreen == 'object') {
        navigator.splashscreen.hide();
    }
}

function hide_div_sem_net() {
    $('#divsemnet').remove();
}

function show_div_sem_net() {
    $('#divsemnet').remove();
    var html = '<div id="divsemnet" style="font-family:Arial">'
            + MSG_SEM_NET
            + '<br><center>'
            + '<img src="app_res/images/icons/sem_net.png">'
            + '</center>'
            + '</div>';
    $('body').append(html);
}

function loadIniScript() {
    var src = CP.URL_APP + 'js/app.js';
    src += '?v=' + CP.jsv;

    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", src);

    document.getElementsByTagName("head")[0].appendChild(fileref);
}

function app_connected() {
    if (typeof navigator == 'undefined' || typeof navigator.connection == 'undefined')
        return true;

    //nova API (direto em navigator.connection)
    if (typeof navigator.connection != 'undefined'
            && typeof navigator.connection.type != 'undefined'
            && navigator.connection.type == Connection.NONE)
        return false;

    return true;
}


function onOnline() {
    if (typeof CP.offline_warn_to != 'undefined') {
        window.clearTimeout(CP.offline_warn_to);
    }
    if (!CP.online) {
        if (typeof jqm_rendered == 'function' && jqm_rendered())
            $.mobile.loading('hide');
    }
    CP.online = true;
}

function onOffline() {
    if (typeof CP.offline_warn_to != 'undefined') {
        window.clearTimeout(CP.offline_warn_to);
    }

    CP.offline_warn_to = window.setTimeout(function() {

        CP.online = false;

        //verificar se ja esta sendo mostrada a msg de "sem net"
        if (!$('#divsemnet').length) {
            nalert(MSG_SEM_NET, 'Sem conexão');
        }
    }, 5000)

}

function startApp() {
    urlveri = 'http://h2.multidadosti.com.br/ultra/mobile/verifica_url.php';
    COMMON_URL_MOBILE = 'http://h2.multidadosti.com.br/ultra/mobile';

    $.ajax({
        type: 'GET',
        url: urlveri,
        dataType: "json",
        timeout: 10000,
        crossDomain: true,
        data: {
            url: COMMON_URL_MOBILE
        },
        error: function(jqXHR, statusText, error) {

                alert('ERROR MOBILE urlveri = ' + urlveri + ' , data.url = ' + COMMON_URL_MOBILE);
                alert(statusText);
                alert(error);
        },
        success: function(data) {
alert('SUCCESS');
alert(data)
        }});
    
    var wait_one_int = true;
    if (app_connected()) {
        loadIniScript();
    } else {
        window.init_interval = window.setInterval(function() {
            if (app_connected()) {
                window.clearInterval(window.init_interval);
                loadIniScript();
            } else {
                if (wait_one_int) {
                    wait_one_int = false;
                } else {
                    splash_hide();
                    show_div_sem_net();
                }
            }
        }, 1000);
    }
}

function onDeviceready() {
    CP.deviceready = true;

    //wp8 nao tem window.alert nativo
    if (typeof window.alert == 'undefined' &&
            typeof navigator != 'undefined' &&
            typeof navigator.notification != 'undefined' &&
            typeof navigator.notification.alert == 'function')
        window.alert = navigator.notification.alert;

    //https://github.com/apache/cordova-plugin-network-information/blob/df7aac845dc7deddbdb76e89216776a802ee8b67/doc/index.md
    //Applications typically should use document.addEventListener to attach an event listener once the deviceready event fires.
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
    startApp();
}


if (localStorage.getItem('destktop_version') != 1) {
    document.addEventListener("deviceready", onDeviceready, false);
} else {
    $(function() {
        startApp();
    });
}

