from flask import Flask
from app.daily_price import daily_price

app = Flask(__name__)
app.register_blueprint(daily_price, url_prefix='/daily_price')

@app.route('/')
def index():
    return 'hoo'


if __name__ == "__main__":
    app.run(debug=True)
