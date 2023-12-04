from flask import Flask, render_template, request

app = Flask(__name__)

# pages
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/timeline')
def timeline():
    return render_template('timeline.html')

# api
@app.route('/api/v1/hello-world-1')
def hello_world_1():
    # return json hello world
    return {'hello': 'world'}