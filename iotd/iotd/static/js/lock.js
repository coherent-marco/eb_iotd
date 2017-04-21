function initAuth0(domain, client_id, connection) {
    var auth0 = new Auth0({
        domain: domain,
        clientID: client_id,
        callbackURL: `${window.location.origin}/callback`,
        responseType: 'code',
    });
    
    $('.auth0-login').click(function () {
        var state,
            _this = $(this);

        if (_this.parents('.modal').length == 1) state = window.location.href;
        else state = searchString.next ? searchString.next : '/';

        _this.parents('.auth0-wrapper').find('.auth0-login').hide();
        _this.parents('.auth0-wrapper').find('.fa-spinner').fadeIn();

        auth0.login({
            connection : connection,
            username: _this.parents('.auth0-wrapper').find('.auth0-username').val(),
            password: _this.parents('.auth0-wrapper').find('.auth0-password').val(),
            state: state,
            sso: false,
        }, function (err) {
            _this.parents('.auth0-wrapper').find('.fa-spinner').hide();
            _this.parents('.auth0-wrapper').find('.auth0-login').fadeIn();
            loginError = _this.parents('.auth0-wrapper').find('#login-error');
            //console.log(err, loginError);
            if (err) {
                //console.log(err);
                loginError.html(gettext(err.message)).fadeIn(100);
                setTimeout(function () {
                    loginError.fadeOut(500)
                }, 5000);
            } else {
                loginError.hide();
            }
        });
    });
    // Prevent default form submission
    $('.auth0-wrapper > form').submit(function (e) {
        e.preventDefault();
    });
}



$(function () {
    // For switching between agent and broker registration
    $('#login_modal div[name="agent"]').click(function () {
        $('#login_modal #registration .agent').show();
        $('#login_modal #registration .broker').hide();
    });
    $('#login_modal div[name="broker"]').click(function () {
        $('#login_modal #registration .agent').hide();
        $('#login_modal #registration .broker').show();
    });
    // Focus on username input when modal is shown
    $("#login_modal").on('shown.bs.modal', function () {
        $('.auth0-username')[0].focus();
    });
    // Enable registration
    var form = $('#login_modal #registration > form');
    form.submit(function (e) {
        var responseText,
            btn = $('#login_modal input.register');

        btn.hide();
        btn.siblings('.fa-spinner').fadeIn();

        e.preventDefault();
        $.ajax({
            url: 'registration',
            type: 'post',
            data: form.serialize(),
            success: function () {
                responseText = gettext('REGIS001');
            },
            error: function () {
                responseText = gettext('REGIS002');
            },
            complete: function () {
                btn.siblings('.fa-spinner').hide();
                btn.fadeIn();
                btn.siblings('#registration-msg').html(responseText).fadeIn(100);
                setTimeout(function () {
                    btn.siblings('#registration-msg').fadeOut(500)
                }, 5000);
            }
        });
    });
});

// [deprecated] Old Auth0 Lock
/*
function initAuth0Lock(domain, clientId) {
    var langDict = {
        title: 'Welcome to Seasonalife',
        emailInputPlaceholder: 'your email'
    };
    if (lang == 'zh-hant') {
        var langDict = {
            title: '歡迎',
            emailInputPlaceholder: '您的電子郵件信箱'
        };
    }
    var options = {
        auth: {
            redirect: true,
            redirectUrl: window.location.origin + '/callback',
            responseType: 'code',
            params: {
                scope: 'openid email',
                state: window.location.href
            }
        },
        // allowedConnections: ['Username-Password-Authentication', 'twitter', 'facebook', 'linkedin', ],
        allowedConnections: ['Username-Password-Authentication',],
        autoclose: true,
        autofocus: true,
        avatar: null,
        closable: true,
        language: lang === 'zh-hant' ? 'zh-tw' : lang,
        languageDictionary: langDict,
        rememberLastLogin: false,
        theme: {
            labeledSubmitButton: false,
            logo: '/static/img/logo/SeasonalifeCircleLogo.png',
            primaryColor: '#3e5b9a',
        },
        allowSignUp: false,
        allowForgotPassword: false
    };
    return new Auth0Lock(clientId, domain, options);
}
*/