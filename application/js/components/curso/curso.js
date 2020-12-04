angular.module('ilog-test').component('curso', {
    
    templateUrl: 'js/components/curso/curso.html',

});

angular.module('ilog-test').controller('CursoController', function ($http) {

    var app = this;

    app.cursos = [];
    app.cursos_carregando = false;
    app.cursos_erro = false;
    app.cursos_disponiveis = [];

    app.inscricoes_carregando = false;
    app.inscricoes_erro = false;
    app.inscricoes = [];

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

    app.exibirInscritos = function (curso) {
        app.curso_selecionado = angular.copy(curso);
        $('#modalInscritosCurso').modal('show');
    }

    app.listarInscritos = function() {
        app.inscricoes_carregando = true;
        app.inscricoes_erro = false;
        app.inscricoes = [];

        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/curso_funcionario?sortBy=createdAt&order=desc",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {   
            app.inscricoes_carregando = false;         
            app.inscricoes = response['data'];
            app.listarFuncionarios();
        }, function(error) {
            console.log(error.data);
            app.inscricoes_carregando = false;
            app.inscricoes_erro = error.data;
        });
    };

    app.listarFuncionarios = function() {
        app.funcionarios = [];
        app.funcionarios_carregando = true;
        app.funcionarios_erro = false;

        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/funcionarios?sortBy=nome&order=asc&",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            app.funcionarios_carregando = false;    
            
            // Filtrar apenas inscricoes do curso selecionado
            let _inscricoes = app.inscricoes.filter(function(i) {
                return i.cursoId == app.curso_selecionado.id;
            });

            // Filtrar funcionarios inscritos no curso
            app.funcionarios =  angular.copy(response['data']['items'].filter(function(f) {
                return _inscricoes.map(function(i) {
                    return parseInt(i.funcionarioId);
                }).includes(parseInt(f.id));
            }).map(function(f) {
                f.admissao = new Date(f.admissao);
                return f;
            }));

        }, function(error) {
            console.log(error);
            alert(error.data);
            app.funcionarios_carregando = false;
            app.funcionarios_erro = error.data;
        });
    };

    $('#modalInscritosCurso').on('show.bs.modal', function (e) {
        app.listarInscritos();
    });
    
    $('#curso_filter').focus();

    app.listarCursos();
});