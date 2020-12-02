angular.module('ilog-test').component('curso', {
    
    templateUrl: 'js/components/curso/curso.html',

    controller: function () {
        this.greeting = 'hello';

        this.toggleGreeting = function () {
            this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello'
        }
    }
});