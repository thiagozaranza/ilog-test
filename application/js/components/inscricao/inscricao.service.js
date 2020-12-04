angular.module('ilog-test').service('InscricaoService', function($http, endpoint) {

    this.listar = function() {       
        return $http({
            method: "GET",
            url: endpoint + "inscricoes?sortBy=createdAt&order=desc",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    };

    this.inserir = function(inscricao) {       
        return $http({
            method: "POST",
            url: endpoint + "inscricoes",
            dataType: 'json',
            data: inscricao,
            headers: { "Content-Type": "application/json" }
        });
    };   

    this.atualizar = function(inscricao) { 
        return $http({
            method: "PUT",
            url: endpoint + "inscricoes/" + inscricao.id,
            dataType: 'json',
            data: inscricao,
            headers: { "Content-Type": "application/json" }
        });
    }

    this.deletar = function(inscricaoId) {
        return $http({
            method: "DELETE",
            url: endpoint + "inscricoes/" + inscricaoId,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    }
});