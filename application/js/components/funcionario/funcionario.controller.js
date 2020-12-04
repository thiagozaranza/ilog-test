angular.module('ilog-test').component('funcionario', {

    templateUrl: 'js/components/funcionario/funcionario.html',

});

angular.module('ilog-test').controller('FuncionarioController', function ($http, FuncionarioService, CursoService, InscricaoService) {

    var app = this;

    app.pagina = 1;
    app.paginas = [];
    app.limite = 100;

    app.funcionarios = [];
    app.funcionarios_carregando = false;
    app.funcionarios_erro = false;
    app.funcionario_selecionado = null;

    app.funcionario_filter = '';

    app.cursos = [];
    app.cursos_carregando = false;
    app.cursos_erro = false;
    app.cursos_disponiveis = [];

    app.historico = [];
    app.historico_carregando = false;
    app.historico_erro = false;

    app.historico_cursos = [];
    app.historico_cursos_carregando = false;
    app.historico_cursos_erro = false;

    app.submitFormCadastro = function(form) {
    
    };

    app.listarCursos = function() {   
        app.cursos_carregando = true; 
        app.cursos_erro = false;    
        CursoService.listar()
            .then(function(response) {
                app.cursos_carregando = false;               
                app.cursos = response['data']['items'];
            }, function(error) {
                app.cursos_carregando = false;
                app.cursos_erro = error.data;
            });
    };

    app.listarCursosDisponiveis = function() {  
        app.cursos_carregando = true;   
        app.cursos_erro = false;    
        CursoService.listar()
            .then(function(response) {           
                app.cursos_carregando = false;  
                let _cursos = response['data']['items'];

                // Remover da lista de cursos aqueles já cursados pelo funcionário
                app.cursos_disponiveis = _cursos.filter(function(c) {
                    return !app.historico_cursos.map(hc => hc.id).includes(c.id);
                });

            }, function(error) {
                app.cursos_carregando = true;
                app.cursos_erro = error.data;
            });
    };

    app.listarHistorico = function() {
        app.historico_carregando = true;
        app.historico_erro = false;
        app.historico = [];

        InscricaoService.listar()
            .then(function(response) {   
                app.historico_carregando = false;         
                app.historico = response['data'];
                app.listarHistoricoCursos();
            }, function(error) {
                console.log(error.data);
                app.historico_carregando = false;
                app.historico_erro = error.data;
            });
    };

    app.listarHistoricoCursos = function() {  
        app.historico_cursos_carregando = true;
        app.historico_cursos_erro = false;
        app.historico_cursos = [];   

        CursoService.listar()
            .then(function(response) {  

                app.historico_cursos_carregando = false;

                // Filtrar apenas histórico do funcionário selecionado
                let _historico = app.historico.filter(function(h) {
                    return h.funcionarioId == app.funcionario_selecionado.id;
                });

                // Filtrar cursos que constam no histórico do funcionário
                let _historico_cursos = angular.copy(response['data']['items'].filter(function(c) {
                    return _historico.map(function(h) {
                        return parseInt(h.cursoId);
                    }).includes(parseInt(c.id));
                }));

                // Injetar o parâmetro data no objeto curso para indicar a data da inscrição
                _historico_cursos.map(function(c) {
                    c.data = _historico.find(function(h) {
                        return h.cursoId == c.id && h.funcionarioId == app.funcionario_selecionado.id
                    }).createdAt;
                    return c;
                });

                app.historico_cursos = _historico_cursos;

            }, function(error) {
                app.historico_cursos_carregando = false;
                app.historico_cursos_erro = error.data;
            });
    };
    
    app.listarFuncionarios = function(pagina) {
        app.pagina = pagina;

        app.funcionarios = [];
        app.funcionarios_carregando = true;
        app.funcionarios_erro = false;

        FuncionarioService.listar()
            .then(function(response) {
                app.funcionarios_carregando = false;            
                app.funcionarios = response['data']['items'].map(function(f) {
                    f.admissao = new Date(f.admissao);
                    return f;
                });
            }, function(error) {
                console.log(error);
                alert(error.data);
                app.funcionarios_carregando = false;
                app.funcionarios_erro = error.data;
            });
    };

    app.cadastrarFuncionario = function(funcionario) {

        FuncionarioService.inserir(funcionario)
            .then(function(response) {
                $('#modalCadastroFuncionario').modal('hide');
                app.listarFuncionarios(1);
            }, function(error) {
                console.log(error);            
                alert(error.data);
            });
    };

    app.localizarFuncionario = function(funcionario) {
        app.funcionarios = [];
        app.funcionarios_carregando = true;
        app.funcionarios_erro = false;

        app.funcionario_filter = funcionario.nome;
        
        FuncionarioService.listar(app.funcionario_filter)
            .then(function(response) {
                app.funcionarios_carregando = false;            
                app.funcionarios = response['data']['items'].map(function(f) {
                    f.admissao = new Date(f.admissao);
                    return f;
                });
            }, function(error) {
                console.log(error);
                app.funcionarios_carregando = false;
                app.funcionarios_erro = error.data;
            });
    };

    app.limparFiltro = function() {
        app.funcionario_filter = '';
        $('#funcionario_filter').val('');
        app.listarFuncionarios(1);
    };

    app.editarFuncionario = function(funcionario) {
        app.funcionario_selecionado = angular.copy(funcionario);
        $('#modalEdicaoFuncionario').modal('show');
    }

    app.updateFuncionario = function() {
        FuncionarioService.atualizar(app.funcionario_selecionado)
            .then(function(response) {
                $('#modalEdicaoFuncionario').modal('hide');
                app.funcionario_selecionado = null;
                app.listarFuncionarios(app.pagina);
            }, function(error) {
                console.log(error);
                alert(error.data);
            });
    };

    app.confirmarDelecaoFuncionario = function(funcionario) {
        app.funcionario_selecionado = angular.copy(funcionario);
        $('#modalConfirmacaoDeleteFuncionario').modal('show');
    };

    app.cancelarDelecaoFuncionario = function() {
        app.funcionario_selecionado = null;
        $('#modalConfirmacaoDeleteFuncionario').modal('hide');
    };

    app.deletarFuncionario = function() {
        FuncionarioService.deletar(app.funcionario_selecionado.id)
            .then(function(response) {
                $('#modalConfirmacaoDeleteFuncionario').modal('hide');            
                app.listarFuncionarios(1);
            }, function(error) {
                console.log(error);
                alert(error.data);
            });
    };

    app.exibirHistorico = function (funcionario) {
        app.funcionario_selecionado = angular.copy(funcionario);
        $('#modalHistoricoFuncionario').modal('show');
    }

    app.selecionarCurso = function(funcionario) {
        app.funcionario_selecionado = angular.copy(funcionario);
        $('#modalSelecionarCurso').modal('show');
    };

    app.inscreverFuncionario = function (curso) {
        let inscricao = {
            cursoId: curso.id,
            funcionarioId: app.funcionario_selecionado.id
        };

        InscricaoService.inserir(inscricao).then(function(response) {            
            $('#modalSelecionarCurso').modal('hide');
            app.historico = [];
            app.historico_cursos = [];
            app.listarHistorico();
        }, function(error) {
            
        });
    };

    app.removerFuncionarioCurso = function (curso) {

        let inscricao = app.historico.find(h => h.funcionarioId == app.funcionario_selecionado.id && h.cursoId == curso.id);

        if (!inscricao) return;
        
        InscricaoService.deletar(inscricao.id)
            .then(function(response) {                        
                app.historico = [];
                app.historico_cursos = [];
                app.listarHistorico();
            }, function(error) {
                console.log(error);
                alert(error.data);
            });
    }

    app.cancelarInscricaoFuncionario = function () {
        app.funcionario_selecionado = null;
        $('#modalSelecionarCurso').modal('hide');
    };

    app.cancelarHistoricoFuncionario = function() {
        app.funcionario_selecionado = null;
        $('#modalHistoricoFuncionario').modal('hide');
    };

    app.listarFuncionarios(1);

    $('#modalCadastroFuncionario').on('show.bs.modal', function (e) {
        $('#appInputNome').val('');
        $('#appInputEndereco').val('');
        $('#appInputTelefone').val('');
        $('#appInputAdmissao').val('');
    });

    $('#modalSelecionarCurso').on('show.bs.modal', function (e) {
        app.listarCursosDisponiveis();
    });

    $('#modalHistoricoFuncionario').on('show.bs.modal', function (e) {
        app.listarHistorico();
    });

    $('#funcionario_filter').focus();
});