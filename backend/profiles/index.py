'''
Business: Manages fame profiles - create, list, update, increment views, delete
Args: event with httpMethod, body, queryStringParameters
Returns: JSON response with profiles or status
'''
import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Secret',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if method == 'GET':
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT id, name, username, description, photo_url, caste, views, created_at FROM fame_profiles ORDER BY views DESC')
        rows = cur.fetchall()
        
        profiles = []
        for row in rows:
            profiles.append({
                'id': row[0],
                'name': row[1],
                'username': row[2],
                'description': row[3],
                'photo_url': row[4],
                'caste': row[5],
                'views': row[6],
                'created_at': row[7].isoformat() if row[7] else None
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'profiles': profiles}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        name = body_data.get('name')
        username = body_data.get('username', '')
        description = body_data.get('description', '')
        photo_url = body_data.get('photo_url', '')
        caste = body_data.get('caste')
        
        if not name or not caste:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Name and caste are required'}),
                'isBase64Encoded': False
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO fame_profiles (name, username, description, photo_url, caste) VALUES (%s, %s, %s, %s, %s) RETURNING id',
            (name, username, description, photo_url, caste)
        )
        profile_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps({'id': profile_id, 'message': 'Profile created'}),
            'isBase64Encoded': False
        }
    
    if method == 'PUT':
        params = event.get('queryStringParameters', {})
        profile_id = params.get('id')
        
        if not profile_id:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Profile ID required'}),
                'isBase64Encoded': False
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('UPDATE fame_profiles SET views = views + 1 WHERE id = %s', (profile_id,))
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'View incremented'}),
            'isBase64Encoded': False
        }
    
    if method == 'PATCH':
        params = event.get('queryStringParameters', {})
        profile_id = params.get('id')
        
        if not profile_id:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Profile ID required'}),
                'isBase64Encoded': False
            }
        
        body_data = json.loads(event.get('body', '{}'))
        name = body_data.get('name')
        username = body_data.get('username', '')
        description = body_data.get('description', '')
        photo_url = body_data.get('photo_url', '')
        caste = body_data.get('caste')
        
        if not name or not caste:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Name and caste are required'}),
                'isBase64Encoded': False
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'UPDATE fame_profiles SET name = %s, username = %s, description = %s, photo_url = %s, caste = %s WHERE id = %s',
            (name, username, description, photo_url, caste, profile_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Profile updated'}),
            'isBase64Encoded': False
        }
    
    if method == 'DELETE':
        params = event.get('queryStringParameters', {})
        profile_id = params.get('id')
        
        if not profile_id:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Profile ID required'}),
                'isBase64Encoded': False
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM fame_profiles WHERE id = %s', (profile_id,))
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Profile deleted'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }