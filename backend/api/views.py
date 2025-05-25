from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from backend.auth0backend import verify_jwt
import requests

@api_view(['GET'])
def protected_view(request):
    user = verify_jwt(request)
    if not user:
        return Response({"error": "Invalid token"}, status=401)
    
    auth_header = request.headers.get('Authorization', '')
    print("Authorization header:", auth_header)  # Debug log
    
    try:
        token = auth_header.split(' ')[1]
    except IndexError:
        return Response({"error": "Authorization token not found"}, status=401)
    
    userinfo = get_userinfo(token)

    
    
    return Response({
        "email": userinfo.get("email"),
        "image": userinfo.get("picture")
    })



def get_userinfo(access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    try:
        response = requests.get('https://dev-tbvg0u76pp8osw76.us.auth0.com/userinfo', headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors
        print("UserInfo response:", response.json())  # Log the user info response
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err} - Response content: {response.text}")
    except Exception as err:
        print(f"Other error occurred: {err}")
    return {}





