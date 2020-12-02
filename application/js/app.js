var app = angular.module('ilog-test', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/usuario');

    var usuarioState = {
        name: 'usuario',
        url: '/usuario',
        component: 'usuario'
    }

    var cursoState = {
        name: 'curso',
        url: '/curso',
        component: 'curso'
    }

    $stateProvider.state(usuarioState);
    $stateProvider.state(cursoState);
});
