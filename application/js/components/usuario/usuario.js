angular.module('ilog-test').component('usuario', {

    templateUrl: 'js/components/usuario/usuario.html',

    controller: function () {
        this.greeting = 'hello';

        this.toggleGreeting = function () {
            this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello'
        }
    }
});

angular.module('ilog-test').controller('UsuarioController', function ($http) {

    var app = this;

    app.usuarios = [];
    
    app.listarUsuarios = function() {
        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/usuarios",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            app.usuarios = response['data'];
        }, function(error) {
            
        });
    };

    app.criarUsuario = function() {
        $http({
            method: "POST",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/usuarios",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            app.listarUsuarios();
        }, function(error) {
            
        });
    }

    app.listarUsuarios();


});