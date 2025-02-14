from flask import jsonify

def init_routes(app):
    @app.route('/api/data')
    def get_data():
        return jsonify({"message": "Hello from Flask!"})
