var app = angular.module('ilog-test', ['ui.router']);

app.constant("endpoint", "https://5fc6d7eff3c77600165d7981.mockapi.io/");

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/funcionario');

    var usuarioState = {
        name: 'funcionario',
        url: '/funcionario',
        component: 'funcionario'
    }

    var cursoState = {
        name: 'curso',
        url: '/curso',
        component: 'curso'
    }

    $stateProvider.state(usuarioState);
    $stateProvider.state(cursoState);
});
