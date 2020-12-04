angular.module('ilog-test').service('FuncionarioService', function($http) {
    
    this.listar = function(search = '') {       
        return $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/funcionarios?sortBy=nome&order=asc&search="+search,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    };

    this.inserir = function(funcionario) {       
        return $http({
            method: "POST",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/funcionarios",
            dataType: 'json',
            data: funcionario,
            headers: { "Content-Type": "application/json" }
        });
    };   

    this.atualizar = function(funcionario) { 
        return $http({
            method: "PUT",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/funcionarios/" + funcionario.id,
            dataType: 'json',
            data: funcionario,
            headers: { "Content-Type": "application/json" }
        });
    }

    this.deletar = function(funcionarioId) {
        return $http({
            method: "DELETE",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/funcionarios/" + funcionarioId,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    }
});