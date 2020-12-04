angular.module('ilog-test').service('InscricaoService', function($http) {

    this.listar = function() {       
        return $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/curso_funcionario?sortBy=createdAt&order=desc",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    };

    this.inserir = function(inscricao) {       
        return $http({
            method: "POST",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/curso_funcionario",
            dataType: 'json',
            data: inscricao,
            headers: { "Content-Type": "application/json" }
        });
    };   

    this.atualizar = function(inscricao) { 
        return $http({
            method: "PUT",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/curso_funcionario/" + inscricao.id,
            dataType: 'json',
            data: inscricao,
            headers: { "Content-Type": "application/json" }
        });
    }

    this.deletar = function(inscricaoId) {
        return $http({
            method: "DELETE",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/curso_funcionario/" + inscricaoId,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    }
});