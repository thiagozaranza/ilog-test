var myApp = angular.module('ilog-test', ['ui.router']);

myApp.config(function ($stateProvider) {
    var helloState = {
        name: 'hello',
        url: '/hello',
        template: '<h3>hello world!</h3>'
    }

    var aboutState = {
        name: 'about',
        url: '/about',
        component: 'hello'
    }

    $stateProvider.state(helloState);
    $stateProvider.state(aboutState);
});

angular.module('ilog-test').component('hello', {
    template: '<h3>{{$ctrl.greeting}} Solar System!</h3>' +
        '<button ng-click="$ctrl.toggleGreeting()">toggle greeting</button>',

    controller: function () {
        this.greeting = 'hello';

        this.toggleGreeting = function () {
            this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello'
        }
    }
})