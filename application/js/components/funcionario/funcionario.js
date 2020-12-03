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
    app.funcionario_selecionado = null;

    app.cursos = [];
    app.historico = [];
    app.historico_cursos = [];

    app.listarCursos = function() {        
        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos?sortBy=titulo&order=asc",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {            
            app.cursos = response['data']['items'];
        }, function(error) {
            
        });
    };

    app.listarHistorico = function() {
        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/curso_funcionario?sortBy=createdAt&order=desc",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {            
            app.historico = response['data'];
            app.listarHistoricoCursos();
        }, function(error) {
            
        });
    };

    app.listarHistoricoCursos = function() {        
        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/cursos?sortBy=titulo&order=asc",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {  

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
            
        });
    };
    
    app.listarFuncionarios = function(pagina) {
        app.pagina = pagina;
        $http({
            method: "GET",
            url: "https://5fc6d7eff3c77600165d7981.mockapi.io/funcionarios?sortBy=nome&order=asc&limit="+app.limite+"&page="+pagina,
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            app.paginas = [...Array(Math.floor(response['data']['count']/app.limite)).keys()];
            app.funcionarios = response['data']['items'];
        }, function(error) {
            
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
            app.listarFuncionarios();
        }, function(error) {
            
        });
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

    app.cancelarMatriculaFuncionario = function () {
        app.funcionario_selecionado = null;
        $('#modalSelecionarCurso').modal('hide');
    };

    app.cancelarHistoricoFuncionario = function() {
        app.funcionario_selecionado = null;
        $('#modalHistoricoFuncionario').modal('hide');
    };

    app.listarFuncionarios(1);

    $('#modalSelecionarCurso').on('show.bs.modal', function (e) {
        app.listarCursos();
    });

    $('#modalHistoricoFuncionario').on('show.bs.modal', function (e) {
        app.historico = [];
        app.historico_cursos = [];
        app.listarHistorico();
    });
    

});