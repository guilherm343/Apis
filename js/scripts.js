async function carregarDados() {
    //Para ocultar 
    const divErro = document.getElementById('div-erro')
    divErro.style.display = 'none'

    //Chamando a API
    await fetch('https://covid19-brazil-api.now.sh/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => prepararDados(dados))
        .catch(e => exibirErro(e.message));

    await fetch('https://covid19-brazil-api.now.sh/api/report/v1/brazil/20200318')
        .then(response2 => response2.json())
        .then(dados2 => prepararDados2(dados2))
        .catch(e2 => exibirErro(e2.message));

    await fetch('https://covid19-brazil-api.now.sh/api/report/v1')
        .then(response3 => response3.json())
        .then(dados3 => prepararDadosTabela(dados3))
        .catch(e3 => exibirErro(e3.message));
}

  function exibirErro(mensagem) {
    let divErro = document.getElementById('div-erro');
    divErro.innerHTML = '<b>Erro ao acessar a API</b><br />' + mensagem;
    divErro.style.display = 'block';
  }
  
  function prepararDados2(dados2) {
    if (dados2['data'].length > 0) {
      dados_tabela = [['Estados', 'Total']];
    }
  
    let total = 0;
    let mortos2 = 0;
    let confirmados = 0;
    let suspeitos = 0;
    let cancelados = 0;
    let estado = '';
  
    for (let i = 0; i < dados2['data'].length; i++) {
      estado += dados2['data'][i].state;
      mortos2 += dados2['data'][i].deaths;
      confirmados += dados2['data'][i].cases;
      cancelados += dados2['data'][i].refuses;
      suspeitos += dados2['data'][i].suspects;
      total = mortos2 + confirmados + cancelados + suspeitos;
    }
  
    dados_tabela.push(['Estados']);
  }
  
  function prepararDados(dados) {
    if (dados['data'].length > 0) {
      dados_pizza = [['Status', 'Total']];
    }
  
    let casos = 0;
    let mortos = 0;
  
    for (let i = 0; i < dados['data'].length; i++) {
      // se o registro atual for de sell
      casos += dados['data'][i].confirmed;
      mortos += dados['data'][i].deaths;
      mapa_dados.push([dados['data'][i].country, dados['data'][i].confirmed]);
    } // fim do for
  
    dados_pizza.push(['Confirmados', casos]);
    dados_pizza.push(['Mortes', mortos]);
  
    prepararDadosMapa(dados);
  
    desenharGrafico();
    desenharMapa();
    desenharTabela();
  }
  
  var mapa_dados = [];
  mapa_dados.push(['Pais', 'Casos']);
  mapa_dados.push(['0', 0]);
  
  var dados_pizza = [];
  dados_pizza.push(['Status', 'Total']);
  dados_pizza.push(['0  ', 0]);


function prepararDadosMapa(dados) {

    if (dados['data'].length > 0) {
        mapa_dados = [['Pais', 'Casos']]
        for (let i = 0; i < dados['data'].length; i++) {
            mapa_dados.push(
                [dados['data'][i].country,
                dados['data'][i].confirmed]
            );
        }
    }
}


google.charts.load('current', {
    'packages': ['geochart'],
});
google.charts.setOnLoadCallback(desenharMapa);

function desenharMapa() {
    let data = google.visualization.arrayToDataTable(mapa_dados);

    let options = {
        title: 'Mapa mundial com dados do COVID-19 ',
        // width: 800,
        // height: 500,
        colorAxis: { colors: ['#f09975', '#e2492e', '#a02517', '#5d0000'] }
    };

    let chart = new google.visualization.GeoChart(document.getElementById('mapa'));

    chart.draw(data, options);
}

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(desenharGrafico);

function desenharGrafico() {

    var data = google.visualization.arrayToDataTable(dados_pizza);

    var options = {
        title: 'Tabela com dados de mortes no mundo',
        // width: 800,
        // height: 500,
        backgroundColor: 'rgb(222, 214, 214)',
        legend: {position: 'bottom'}
    };

    var chart = new google.visualization.PieChart(document.getElementById('pizza'));

    chart.draw(data, options);
}

google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(desenharTabela);

var  dados_tabela = [];

google.charts.load('current', { 'packages': ['table'] });
google.charts.setOnLoadCallback(desenharTabela);

function prepararDadosTabela(dados) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Estado');
    data.addColumn('number', 'Confirmados');
    data.addColumn('number', 'Mortes');
    data.addColumn('number', 'Suspeitos');
    data.addColumn('number', 'Cancelados');
    data.addRows([    ['Acre', 100000, 2000, 300, 4000],
      ['Alagoas', 150000, 3000, 400, 5000],
      ['Amapá', 50000, 1000, 200, 1000],
      ['Amazonas', 350000, 8000, 1000, 9000],
      ['Bahia', 500000, 10000, 1500, 12000],
      ['Ceará', 400000, 7500, 800, 8000],
      ['Distrito Federal', 903.944, 11.854, 500, 3000],
      ['Espírito Santo', 250000, 5000, 700, 4000],
      ['Goiás', 300000, 6000, 1000, 6000],
      ['Maranhão', 200000, 3500, 500, 4000],
      ['Mato Grosso', 150000, 2500, 400, 2000],
      ['Mato Grosso do Sul', 100000, 2000, 300, 1500],
      ['Minas Gerais', 600000, 12000, 2000, 15000],
      ['Pará', 250000, 5000, 800, 5000],
      ['Paraíba', 200000, 4000, 600, 4000],
      ['Paraná', 400000, 8000, 1000, 7000],
      ['Pernambuco', 350000, 7000, 900, 6000],
      ['Piauí', 100000, 1500, 300, 2000],
      ['Rio de Janeiro', 700000, 15000, 2000, 20000],
      ['Rio Grande do Norte', 150000, 3000, 400, 3000],
      ['Rio Grande do Sul', 350000, 7000, 900, 8000],
      ['Rondônia', 50000, 1000, 200, 1000],
      ['Roraima', 20000, 500, 100, 500],
      ['Santa Catarina', 400000, 8000, 1000, 7000],
      ['São Paulo', 1000000, 20000, 3000, 25000],
      ['Sergipe', 100000, 2000, 300, 2500],
      ['Tocantins', 50000, 1000, 200, 1000]
    ]);

    var table = new google.visualization.Table(document.getElementById('tabela')); 
    table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });

}


function desenharTabela(dados) {
    console.table(dados)


}

document.addEventListener(  "carregarDados",
                            function(event) {
                                desenharGrafico();
                                desenharMapa();
                                desenharTabela();
                            }
);
