angular.module('ilog-test').service('FuncionarioService', function($http, endpoint) {
    
    this.listar = function(search = '') {       
        return $http({
            method: "GET",
            url: endpoint + "funcionarios?sortBy=nome&order=asc&search="+search,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    };

    this.inserir = function(funcionario) {       
        return $http({
            method: "POST",
            url: endpoint + "funcionarios",
            dataType: 'json',
            data: funcionario,
            headers: { "Content-Type": "application/json" }
        });
    };   

    this.atualizar = function(funcionario) { 
        return $http({
            method: "PUT",
            url: endpoint + "funcionarios/" + funcionario.id,
            dataType: 'json',
            data: funcionario,
            headers: { "Content-Type": "application/json" }
        });
    }

    this.deletar = function(funcionarioId) {
        return $http({
            method: "DELETE",
            url: endpoint + "funcionarios/" + funcionarioId,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    }
});