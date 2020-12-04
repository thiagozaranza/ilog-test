angular.module('ilog-test').component('curso', {
    
    templateUrl: 'js/components/curso/curso.html',

});

angular.module('ilog-test').controller('CursoController', function ($http) {

    var app = this;

    app.cursos = [];
    app.cursos_carregando = false;
    app.cursos_erro = false;
    app.cursos_disponiveis = [];

    app.submitFormCadastro = function(form) {
    
    };

    app.listarCursos = function() {   
        app.cursos_carregando = true; 
        app.cursos_erro = false;    
        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos?sortBy=titulo&order=asc",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            app.cursos_carregando = false;               
            app.cursos = response['data']['items'];
        }, function(error) {
            app.cursos_carregando = false;
            app.cursos_erro = error.data;
        });
    };

    app.localizarCurso = function(curso) {
        app.cursos = [];
        app.cursos_carregando = true;
        app.cursos_erro = false;

        app.curso_filter = curso.nome;
        
        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos?sortBy=titulo&order=asc&search="+app.curso_filter,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            app.cursos_carregando = false;            
            app.cursos = response['data']['items'].map(function(f) {
                f.admissao = new Date(f.admissao);
                return f;
            });
        }, function(error) {
            console.log(error);
            app.cursos_carregando = false;
            app.cursos_erro = error.data;
        });
    };

    app.cadastrarCurso = function(curso) {

        $http({
            method: "POST",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos",
            dataType: 'curso',
            data: curso,
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            $('#modalCadastroCurso').modal('hide');
            app.listarCursos();
        }, function(error) {
            console.log(error);            
            alert(error.data);
        });
    };

    app.limparFiltro = function() {
        app.curso_filter = '';
        $('#curso_filter').val('');
        app.listarCursos();
    };

    $('#modalCadastroCurso').on('show.bs.modal', function (e) {
        $('#appInputCursoTitulo').val('');
        $('#appInputCursoDescricao').val('');
        $('#appInputCursoCargaH').val('');
        $('#appInputCursoValor').val('');
    });

    app.editarCurso = function(curso) {
        app.curso_selecionado = angular.copy(curso);
        $('#modalEditarCurso').modal('show');
    }

    app.updateCurso = function() {
        $http({
            method: "PUT",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos/" + app.curso_selecionado.id,
            dataType: 'json',
            data: app.curso_selecionado,
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            $('#modalEditarCurso').modal('hide');
            app.curso_selecionado = null;
            app.listarCursos();
        }, function(error) {
            console.log(error);
            alert(error.data);
        });
    };

    app.confirmarDelecaoCurso = function(curso) {
        app.curso_selecionado = angular.copy(curso);
        $('#modalConfirmacaoDeleteCurso').modal('show');
    };

    app.cancelarDelecaoFuncionario = function() {
        app.curso_selecionado = null;
        $('#modalConfirmacaoDeleteCurso').modal('hide');
    };

    app.deletarCurso = function() {
        $http({
            method: "DELETE",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos/" + app.curso_selecionado.id,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            $('#modalConfirmacaoDeleteCurso').modal('hide');            
            app.listarCursos();
        }, function(error) {
            console.log(error);
            alert(error.data);
        });
    };

    app.exibirInscritos = function (funcionario) {
        app.funcionario_selecionado = angular.copy(funcionario);
        $('#modalHistoricoFuncionario').modal('show');
    }
    
    $('#curso_filter').focus();

    app.listarCursos();
});