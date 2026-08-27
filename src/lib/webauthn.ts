/**
 * Native Browser WebAuthn / FIDO2 Android Biometric Passkey Engine
 * Enables Android Fingerprint, Face Unlock & Hardware Security Token Authentication
 */

export const isWebAuthnSupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === 'function'
  );
};

export const registerBiometricPasskey = async (userId: string, userEmail: string): Promise<{ success: boolean; credentialId?: string; error?: string }> => {
  if (!isWebAuthnSupported()) {
    return { success: false, error: 'WebAuthn hardware passkeys not supported on this browser' };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'LifeLink AI Emergency System',
        id: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
      },
      user: {
        id: Uint8Array.from(userId, (c) => c.charCodeAt(0)),
        name: userEmail,
        displayName: userEmail.split('@')[0],
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Android device fingerprint / Face ID
        userVerification: 'required',
      },
      timeout: 60000,
      attestation: 'none',
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    }) as PublicKeyCredential;

    if (credential) {
      return { success: true, credentialId: credential.id };
    }
    return { success: false, error: 'Credential generation returned empty' };
  } catch (err: any) {
    console.log('WebAuthn Registration Error:', err);
    return { success: false, error: err.message || 'Passkey enrollment cancelled' };
  }
};

export const authenticateBiometricPasskey = async (): Promise<{ success: boolean; credentialId?: string; error?: string }> => {
  if (!isWebAuthnSupported()) {
    return { success: false, error: 'WebAuthn hardware passkeys not supported on this browser' };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      timeout: 60000,
      userVerification: 'required',
      rpId: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    }) as PublicKeyCredential;

    if (assertion) {
      return { success: true, credentialId: assertion.id };
    }
    return { success: false, error: 'Fingerprint scan returned empty' };
  } catch (err: any) {
    console.log('WebAuthn Authentication Error:', err);
    return { success: false, error: err.message || 'Fingerprint / Passkey verification cancelled' };
  }
};
