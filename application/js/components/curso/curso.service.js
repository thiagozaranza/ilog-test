angular.module('ilog-test').service('CursoService', function($http, endpoint) {
    
    this.listar = function(search = '') {       
        return $http({
            method: "GET",
            url: endpoint + "cursos?sortBy=titulo&order=asc&search="+search,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    };

    this.inserir = function(curso) {       
        return $http({
            method: "POST",
            url: endpoint + "cursos",
            dataType: 'json',
            data: curso,
            headers: { "Content-Type": "application/json" }
        });
    };   

    this.atualizar = function(curso) { 
        return $http({
            method: "PUT",
            url: endpoint + "cursos/" + curso.id,
            dataType: 'json',
            data: curso,
            headers: { "Content-Type": "application/json" }
        });
    }

    this.deletar = function(cursoId) {
        return $http({
            method: "DELETE",
            url: endpoint + "cursos/" + cursoId,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    }
});