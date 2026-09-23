const ITERATIONS = 210_000;
const ALGORITHM = 'PBKDF2-SHA-256';
const encoder = new TextEncoder();

function cryptoApi(candidate) {
  if (!candidate?.getRandomValues || !candidate?.subtle) {
    throw new Error('Este navegador não oferece Web Crypto para proteger a senha.');
  }
  return candidate;
}

function encode(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

function decode(value) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

async function derive(password, salt, iterations, cryptoImpl) {
  const key = await cryptoImpl.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await cryptoImpl.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    256,
  );
  return new Uint8Array(bits);
}

export async function createPasswordRecord(password, candidate = globalThis.crypto) {
  if (typeof password !== 'string' || !password) {
    throw new TypeError('Senha deve ser informada.');
  }
  const cryptoImpl = cryptoApi(candidate);
  const salt = cryptoImpl.getRandomValues(new Uint8Array(16));
  const passwordHash = await derive(password, salt, ITERATIONS, cryptoImpl);
  return {
    algorithm: ALGORITHM,
    iterations: ITERATIONS,
    salt: encode(salt),
    passwordHash: encode(passwordHash),
  };
}

export async function verifyPassword(password, record, candidate = globalThis.crypto) {
  const cryptoImpl = cryptoApi(candidate);
  const actual = await derive(password, decode(record.salt), record.iterations, cryptoImpl);
  const expected = decode(record.passwordHash);
  return actual.length === expected.length
    && actual.every((byte, index) => byte === expected[index]);
}
