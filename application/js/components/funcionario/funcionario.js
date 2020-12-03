angular.module('ilog-test').component('funcionario', {

    templateUrl: 'js/components/funcionario/funcionario.html',

    controller: function () {
        this.greeting = 'hello';

        this.toggleGreeting = function () {
            this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello'
        }
    }
});

angular.module('ilog-test').controller('FuncionarioController', function ($http) {

    var app = this;

    app.pagina = 1;
    app.paginas = [];
    app.limite = 100;

    app.funcionarios = [];
    app.funcionarios_carregando = false;
    app.erro_funcionarios = false;
    app.funcionario_selecionado = null;
    app.funcionario_filter = '';

    app.cursos = [];
    app.cursos_carregando = false;
    app.cursos_disponiveis = [];

    app.historico = [];
    app.carregando_historico = false;

    app.historico_cursos = [];
    app.historico_cursos_carregando = false;

    app.submitFormCadastro = function(form) {
    
    };

    app.listarCursos = function() {   
        app.cursos_carregando = true;     
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
        });
    };

    app.listarCursosDisponiveis = function() {  
        app.cursos_carregando = true;       
        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos?sortBy=titulo&order=asc",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {           
            app.cursos_carregando = false;  
            let _cursos = response['data']['items'];

            // Remover da lista de cursos aqueles já cursados pelo funcionário
            app.cursos_disponiveis = _cursos.filter(function(c) {
                return !app.historico_cursos.map(hc => hc.id).includes(c.id);
            });

        }, function(error) {
            app.cursos_carregando = true;
        });
    };

    app.listarHistorico = function() {
        app.carregando_historico = true;
        app.historico = [];

        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/curso_funcionario?sortBy=createdAt&order=desc",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {   
            app.carregando_historico = false;         
            app.historico = response['data'];
            app.listarHistoricoCursos();
        }, function(error) {
            app.carregando_historico = false;
        });
    };

    app.listarHistoricoCursos = function() {  
        app.historico_cursos_carregando = true;
        app.historico_cursos = [];   

        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos?sortBy=titulo&order=asc",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {  

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

            // Injetar o parâmetro data no objeto curso para indicar a data da matrícula
            _historico_cursos.map(function(c) {
                c.data = _historico.find(function(h) {
                    return h.cursoId == c.id && h.funcionarioId == app.funcionario_selecionado.id
                }).createdAt;
                return c;
            });

            app.historico_cursos = _historico_cursos;

        }, function(error) {
            app.historico_cursos_carregando = false;
        });
    };
    
    app.listarFuncionarios = function(pagina) {
        app.pagina = pagina;

        app.funcionarios = [];
        app.funcionarios_carregando = true;

        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/funcionarios?sortBy=nome&order=asc&limit="+app.limite+"&page="+pagina,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            app.funcionarios_carregando = false;            
            app.funcionarios = response['data']['items'].map(function(f) {
                f.admissao = new Date(f.admissao);
                return f;
            });
        }, function(error) {
            app.funcionarios_carregando = false;
        });
    };

    app.cadastrarFuncionario = function(funcionario) {

        $http({
            method: "POST",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/funcionarios",
            dataType: 'json',
            data: funcionario,
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            $('#modalCadastroFuncionario').modal('hide');
            app.listarFuncionarios(1);
        }, function(error) {
            
        });
    };

    app.localizarFuncionario = function(funcionario) {
        app.funcionarios = [];
        app.funcionarios_carregando = true;

        app.funcionario_filter = funcionario.nome;
        
        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/funcionarios?sortBy=nome&order=asc&limit="+app.limite+"&page=1&search="+app.funcionario_filter,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            app.funcionarios_carregando = false;            
            app.funcionarios = response['data']['items'].map(function(f) {
                f.admissao = new Date(f.admissao);
                return f;
            });
        }, function(error) {
            app.funcionarios_carregando = false;
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

    app.atualizarFuncionario = function() {
        $http({
            method: "PUT",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/funcionarios/" + app.funcionario_selecionado.id,
            dataType: 'json',
            data: app.funcionario_selecionado,
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            $('#modalEdicaoFuncionario').modal('hide');
            app.funcionario_selecionado = null;
            app.listarFuncionarios(app.pagina);
        }, function(error) {
            
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
        $http({
            method: "DELETE",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/funcionarios/" + app.funcionario_selecionado.id,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            $('#modalConfirmacaoDeleteFuncionario').modal('hide');            
            app.listarFuncionarios(1);
        }, function(error) {
            
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

    app.matricularFuncionario = function (curso) {
        $http({
            method: "POST",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/curso_funcionario",
            dataType: 'json',
            data: {
                cursoId: curso.id,
                funcionarioId: app.funcionario_selecionado.id
            },
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {            
            $('#modalSelecionarCurso').modal('hide');
            app.historico = [];
            app.historico_cursos = [];
            app.listarHistorico();
        }, function(error) {
            
        });
    };

    app.removerFuncionarioCurso = function (curso) {

        let _historico = app.historico.filter(function(h) {
            return h.funcionarioId == app.funcionario_selecionado.id && h.cursoId == curso.id;
        });

        if (!_historico) return;

        $http({
            method: "DELETE",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/curso_funcionario/" + _historico[0].id,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {                        
            app.historico = [];
            app.historico_cursos = [];
            app.listarHistorico();
        }, function(error) {
            
        });
    }

    app.cancelarMatriculaFuncionario = function () {
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