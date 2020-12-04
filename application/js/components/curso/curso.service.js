angular.module('ilog-test').service('CursoService', function($http) {
    
    this.listar = function(search = '') {       
        return $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos?sortBy=titulo&order=asc&search="+search,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    };

    this.inserir = function(curso) {       
        return $http({
            method: "POST",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos",
            dataType: 'json',
            data: curso,
            headers: { "Content-Type": "application/json" }
        });
    };   

    this.atualizar = function(curso) { 
        return $http({
            method: "PUT",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos/" + curso.id,
            dataType: 'json',
            data: curso,
            headers: { "Content-Type": "application/json" }
        });
    }

    this.deletar = function(cursoId) {
        return $http({
            method: "DELETE",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos/" + cursoId,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        });
    }
});