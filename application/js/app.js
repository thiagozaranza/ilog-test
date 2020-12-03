var app = angular.module('ilog-test', ['ui.router']);

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
