import json
import urllib.request
from jose import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

AUTH0_DOMAIN = 'dev-tbvg0u76pp8osw76.us.auth0.com'
API_IDENTIFIER = 'https://dev-tbvg0u76pp8osw76.us.auth0.com/api/v2/'
ALGORITHMS = ['RS256']

def verify_jwt(request):
    auth = request.META.get("HTTP_AUTHORIZATION", None)
    if auth is None:
        raise AuthenticationFailed("No auth token provided")

    token = auth.split()[1]
    jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    jwks = json.loads(urllib.request.urlopen(jwks_url).read())

    unverified_header = jwt.get_unverified_header(token)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }

    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_IDENTIFIER,
                issuer=f"https://{AUTH0_DOMAIN}/",
            )
            return payload
        except Exception as e:
            raise AuthenticationFailed(str(e))
    raise AuthenticationFailed("Invalid token")
