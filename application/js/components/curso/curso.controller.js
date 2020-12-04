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

    app.funcionarios = [];
    app.funcionarios_carregando = true;
    app.funcionarios_erro = false;

    app.funcionarios_diponiveis = [];
    app.funcionarios_diponiveis_carregando = true;
    app.funcionarios_diponiveis_erro = false;

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
                let _inscricoes = app.inscricoes.filter(i => i.cursoId == app.curso_selecionado.id);

                // Filtrar funcionarios inscritos no curso
                app.funcionarios = angular.copy(response['data']['items'].filter(function(f) {
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

    app.listarFuncionariosDisponiveis = function() {
        
        app.funcionarios_disponiveis_carregando = true; 

        FuncionarioService.listar()
            .then(function(response) {
                app.funcionarios_disponiveis_carregando = false;    
                
                // Filtrar apenas inscricoes do curso selecionado
                let _inscricoes = app.inscricoes
                    .filter(i => i.cursoId == app.curso_selecionado.id)
                    .map(i => parseInt(i.funcionarioId))

                // Filtrar funcionarios não inscritos no curso
                app.funcionarios_disponiveis = response['data']['items']
                    .filter(f => !_inscricoes.includes(parseInt(f.id)));

            }, function(error) {
                console.log(error);
                alert(error.data);
                app.funcionarios_disponiveis_carregando = false;
                app.funcionarios_disponiveis_erro = error.data;
            });
    }

    app.inscreverFuncionario = function (funcionario) {

        let inscricao = {
            cursoId: app.curso_selecionado.id,
            funcionarioId: funcionario.id
        };

        InscricaoService.inserir(inscricao)
            .then(function(response) {
                $('#modalInscreverFuncionario').modal('hide');
                app.listarInscritos();
            }, function(error) {
                console.log(error);
                alert(error.data);
            });
    }

    app.exportarPDF = function() {

        FuncionarioService.listar()
            .then(function(response) {                
                let _funcionarios =  response['data']['items'];
                InscricaoService.listar()
                    .then(function(response) {                
                        let _inscricoes = response['data'];
                        app.makePDF(_funcionarios, _inscricoes);
                    }, function(error) {
                        console.log(error);
                        alert(error.data);                
                    }); 

            }, function(error) {
                console.log(error);
                alert(error.data);                
            });
    } 
    
    app.makePDF = function(funcionarios, inscricoes) {

        var docDefinition = {
            content: app.parseCursos(funcionarios, inscricoes),
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

        pdfMake.createPdf(docDefinition).download("cursos.pdf");    
    };

    app.exportarPDFCurso = function() {
        
        var docDefinition = {
            content: [
                {text: app.curso_selecionado.titulo, style: 'header'},
                {text: app.curso_selecionado.descricao, style: 'subheader'},
                {text: 'Funcionarios inscritos'},
                {
                    style: 'tableExample',
                    table: {
                        body: app.parseFuncionarios(app.funcionarios)
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
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 5]
                }               
            }            
        };

        pdfMake.createPdf(docDefinition).download("inscritos.pdf");    
    };

    app.parseFuncionarios = function(funcionarios) 
    {
        return [...funcionarios.map(function(f) {
            return [f.nome, f.telefone, f.endereco]
        })];
    }

    app.parseCursos = function(funcionarios, inscricoes) 
    {
        let content = [];

        content.push({text: "HeliosTur - Treinamentos", style: 'header'});
        content.push({text: "Todos os cursos oferecidos:", style: 'subheader'});

        for (const i in app.cursos) {

            let _curso = app.cursos[i];

            // Filtrar inscrições referentes ao curso. Retorna a lista dos ids dos funcionários inscritos.
            let _inscricoes = inscricoes.filter(i => parseInt(i.cursoId) == parseInt(_curso.id)).map(i => parseInt(i.funcionarioId));

            if (_inscricoes.length == 0)
                continue;

            // Filtrar funcionarios inscritos no curso
            let _funcionarios = funcionarios.filter(i => _inscricoes.includes(parseInt(i.id)));

            content.push({text: _curso.titulo, style: 'subheader'});
            content.push({text: _curso.descricao});
            content.push({
                style: 'tableExample',
                table: {
                    body: app.parseFuncionarios(_funcionarios)
                }
            });
        }

        return content;
    }

    $('#modalInscritosCurso').on('show.bs.modal', function (e) {
        app.listarInscritos();
    });

    $('#modalInscreverFuncionario').on('show.bs.modal', function (e) {
        app.listarFuncionariosDisponiveis();
    });
    
    $('#curso_filter').focus();

    app.listarCursos();
});