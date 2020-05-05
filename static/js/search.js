$('#search_tickers').select2({
    width: '40%',
    allowClear: true,
    templateResult: function(item){
        if (!item.id) {
            return item.symbol;
        }
        var $container = $(
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__avatar' style='float: left;margin-right: 10px;height: 90px;width: 90px'><img style='width:90px' src='https://financialmodelingprep.com/images-New-jpg/"+item.symbol+".jpg' onerror=`${this.src=''}`></div>" +
            "<div class='select2-result-repository__meta'>" +
              "<div class='select2-result-repository__title'></div>" +
              "<div class='select2-result-repository__description'></div>" +
              "<div class='select2-result-repository__statistics'>" +
                "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> </div>" +
                "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> </div>" +
                "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> </div>" +
              "</div>" +
            "</div>" +
          "</div>"
        );

        $container.find(".select2-result-repository__title").text(`Symbol: ${item.symbol}`);
        $container.find(".select2-result-repository__description").text(`Name: ${item.name}`);
        $container.find(".select2-result-repository__forks").append(`Currency: ${item.currency}`);
        $container.find(".select2-result-repository__stargazers").append(`Stock Exchange: ${item.stockExchange}`);
        $container.find(".select2-result-repository__watchers").append(`Exchange short name: ${item.exchangeShortName}`);

        return $container;
    },
    ajax: {
        url: 'https://financialmodelingprep.com/api/v3/search?limit=10&exchange=NASDAQ',
        dataType: 'json',
        type: "GET",
        delay: 250,
        data: function (params) {
            return {
                query: params.term
            };
        },
        processResults: function (data) {
            var res = data.map(function (item) {
                return {id: item.symbol, text: item.symbol, symbol: item.symbol, name: item.name, currency: item.currency, stockExchange: item.stockExchange, exchangeShortName: item.exchangeShortName};
            });
            return {
                results: res
            };
        }
    },
});
$('#search_tickers').change(function(){
    let selected_tickers = [];
    $('#search_tickers').select2('data').forEach(element => {
        selected_tickers.push(element.text);
    });
    $.ajax({
        url: 'http://localhost:5000/daily_price/show_results/',
        method: 'post',
        dataType: 'json',
        data: { tickers: selected_tickers.join(',') },
        success: draw_chart
    });
});

function draw_chart(data){
    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from( Object.values(data.date)),
            datasets: [{
                label: 'Daily Return',
                data: Array.from( Object.values(data.returns_1d)),
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}