angular.module('ilog-test').component('curso', {
    
    templateUrl: 'js/components/curso/curso.html',

});

angular.module('ilog-test').controller('CursoController', function ($http, FuncionarioService, CursoService, InscricaoService) {

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
        CursoService.listar().then(function(response) {
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
        
        CursoService.listar(app.curso_filter)
            .then(function(response) {
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

        CursoService.inserir(curso)
            .then(function(response) {
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
        CursoService.atualizar(app.curso_selecionado)
            .then(function(response) {
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
        CursoService.deletar(app.curso_selecionado.id).then(function(response) {
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

    app.cancelarInscritosCurso = function() {
        app.curso_selecionado = null;
        $('#modalInscritosCurso').modal('hide');
    }

    app.listarInscritos = function() {
        app.inscricoes_carregando = true;
        app.inscricoes_erro = false;
        app.inscricoes = [];

        InscricaoService.listar()
            .then(function(response) {   
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

        FuncionarioService.listar()
            .then(function(response) {
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

    app.exportarPDF = function() {
        
        var docDefinition = {
            content: [
                {text: app.curso_selecionado.titulo, style: 'header'},
                {text: app.curso_selecionado.descricao, style: 'subheader'},
                {text: 'Funcionarios inscritos'},
                {
                    style: 'tableExample',
                    table: {
                        body: app.parseFuncionarios()
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 15]
                },
                tableExample: {
                    margin: [0, 15, 0, 15]
                }               
            }            
        };

        pdfMake.createPdf(docDefinition).download("inscritos.pdf");    
    };

    app.parseFuncionarios = function() 
    {
        return [...app.funcionarios.map(function(f) {
            return [f.nome, f.telefone, f.endereco]
        })];
    }

    $('#modalInscritosCurso').on('show.bs.modal', function (e) {
        app.listarInscritos();
    });
    
    $('#curso_filter').focus();

    app.listarCursos();
});