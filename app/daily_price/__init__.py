from flask import Blueprint

daily_price = Blueprint('daily_price', __name__, template_folder='templates')

from app.daily_price import routes