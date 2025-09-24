import { JwtUtil } from './jwt-utils';

describe('JwtUtil', () => {
  describe('urlBase64Decode', () => {
    it('should decode a valid base64url string', () => {
      // "hello" in base64url is "aGVsbG8"
      const encoded = 'aGVsbG8';
      expect(JwtUtil.urlBase64Decode(encoded)).toBe('hello');
    });

    it('should decode a valid base64url string with padding needed', () => {
      // "test" in base64url is "dGVzdA"
      const encoded = 'dGVzdA';
      expect(JwtUtil.urlBase64Decode(encoded)).toBe('test');
    });

    it('should decode a string with "-" and "_" replaced', () => {
      // "foo-bar" in base64url is "Zm9vLWJhcg"
      const encoded = 'Zm9vLWJhcg';
      expect(JwtUtil.urlBase64Decode(encoded)).toBe('foo-bar');
    });
  });

  describe('decodeToken', () => {
    it('should decode a valid JWT token', () => {
      // header: {"alg":"HS256","typ":"JWT"}
      // payload: {"sub":"1234567890","name":"John Doe","admin":true}
      // signature: dummy
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const payload = btoa(JSON.stringify({ sub: '1234567890', name: 'John Doe', admin: true }))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const token = `${header}.${payload}.signature`;
      const decoded = JwtUtil.decodeToken(token);
      expect(decoded).toEqual({ sub: '1234567890', name: 'John Doe', admin: true });
    });

    it('should return null for token with invalid parts', () => {
      expect(JwtUtil.decodeToken('invalid.token')).toBeNull();
    });
  });
});