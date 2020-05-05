from flask import render_template, request
from app.daily_price import daily_price
import requests
import pandas as pd


@daily_price.route('/')
def daily_price_index():
    return render_template('daily_price/search.html')

@daily_price.route('/show_results/', methods=['POST', 'GET'])
def show_results():
    if request.method == 'POST':
        tickers = request.form.get('tickers')
        for ticker in tickers.split(','):
            print(ticker)
        return test(ticker)

@daily_price.route('/test/<ticker>')
def test(ticker):
    r = requests.get('https://financialmodelingprep.com/api/v3/historical-price-full/'+ticker)
    x = r.json()
    df = pd.DataFrame(x['historical'])
    df = df[['date','adjClose']]
    df = df.rename(columns={"adjClose": "adj_close"})
    df['prev_adj_close'] = df['adj_close'].shift(1)
    df['returns_1d'] = (df['adj_close']/df['prev_adj_close'])-1
    return df.tail(50).to_json(orient='columns')