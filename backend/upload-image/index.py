'''
Business: Upload image to temporary storage and return URL
Args: event with httpMethod, body (base64 image)
Returns: JSON with image URL
'''
import json
import base64
import uuid
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        image_base64 = body_data.get('image', '')
        
        if not image_base64:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'No image provided'}),
                'isBase64Encoded': False
            }
        
        image_id = str(uuid.uuid4())
        image_url = f"data:image/jpeg;base64,{image_base64}"
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'url': image_url}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
