import base64
import os
import hashlib
from cryptography.fernet import Fernet
from backend.core.config import settings

def _get_encryption_key() -> bytes:
    """Generate deterministic 32-byte Fernet key derived from JWT_SECRET_KEY"""
    key_bytes = hashlib.sha256(settings.JWT_SECRET_KEY.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(key_bytes)

def encrypt_medical_data(plain_text: str) -> str:
    """Encrypt sensitive citizen medical data with AES-256 / Fernet"""
    if not plain_text:
        return ""
    fernet = Fernet(_get_encryption_key())
    encrypted = fernet.encrypt(plain_text.encode('utf-8'))
    return encrypted.decode('utf-8')

def decrypt_medical_data(cipher_text: str) -> str:
    """Decrypt sensitive citizen medical data for authorized responders"""
    if not cipher_text:
        return ""
    try:
        fernet = Fernet(_get_encryption_key())
        decrypted = fernet.decrypt(cipher_text.encode('utf-8'))
        return decrypted.decode('utf-8')
    except Exception:
        return "[ENCRYPTED DATA UNREADABLE OR CORRUPTED]"
