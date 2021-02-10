import { createClient, request } from '../src';

describe('request', () => {
  it('custom client', async () => {
    let client = createClient('http://httpbin.org');
    let res = await client.get('/get?a=b');
    expect(res.args.a).toBe('b');
  });

  it('default client', async () => {
    let res = await request.post('http://httpbin.org/post', {
      x: 'y'
    });
    expect(res.json.x).toBe('y');
  });
});
