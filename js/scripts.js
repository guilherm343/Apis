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
        width: 800,
        height: 500,
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
        width: 800,
        height: 500,
        backgroundColor: 'rgb(222, 214, 214)'
    };

    var chart = new google.visualization.PieChart(document.getElementById('pizza'));

    chart.draw(data, options);
}

google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(desenharTabela);

function prepararDadosTabela(dados) {
    let dados_tabela = [];
    if (dados['data'].length > 0) {
        dados_tabela.push(['Estado', 'Confirmados', 'Mortes', 'Suspeitos', 'Cancelados']);
        for (let i = 0; i < dados['data'].length; i++) {
            dados_tabela.push([
                dados['data'][i].state,
                dados['data'][i].cases,
                dados['data'][i].deaths,
                dados['data'][i].suspects,
                dados['data'][i].refuses
            ]);
        }
    }
    desenharTabela(dados_tabela);
}

google.charts.load('current', { 'packages': ['table'] });
google.charts.setOnLoadCallback(desenharTabela);

function desenharTabela(dados) {
    let data = new google.visualization.arrayToDataTable(dados);

    let table = new google.visualization.Table(document.getElementById('tabela'));

    table.draw(data, { showRowNumber: true, width: '400px', height: '600px' });

    let options = {
        title: 'Tabela com dados de COVID-19 no Brasil'

    }


}
