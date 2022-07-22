import flask
from urllib.parse import urlencode
import requests
import sys


app = flask.Flask(__name__)
CLIENT_ID = sys.argv[1]
CLIENT_SECRET = sys.argv[2]
REDIRECT_URI = 'http://localhost:9123/redirect'


@app.route('/redirect')
def redirect():
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': flask.request.args['code'],
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URI
    }
    with requests.post("https://id.twitch.tv/oauth2/token", params=params) as r:
        r.raise_for_status()
        return f'http://127.0.0.1:3000/#{CLIENT_ID}/{CLIENT_SECRET}/{r.json()["access_token"]}/{r.json()["refresh_token"]}'


@app.route('/')
def test():
    params = {
        'client_id': CLIENT_ID,
        'redirect_uri': REDIRECT_URI,
        'response_type': 'code',
        'scope': "channel%3Aread%3Aredemptions",
    }
    params_str = '&'.join(f"{k}={v}" for k, v in params.items())
    return f"""
        <a href="https://id.twitch.tv/oauth2/authorize?{params_str}">
            Connect with Twitch
        </a>
    """


def main():
    app.run(port=9123)


if __name__ == '__main__':
    main()
