from flask import Blueprint,jsonify  

api_bp = Blueprint("api",__name__)

@api_bp.route("/get-air-quality")
def get-air-quality():
    data = {}
    return jsonify(data)
