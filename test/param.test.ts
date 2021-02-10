import { paramUrl } from '../src';

describe('paramUrl', () => {
  it('replaces params', () => {
    let param1 = paramUrl('/api/abc/{1}/a/{2}');
    let param2 = paramUrl('/api/abc');

    expect(param1({ 1: 'xy', 2: 'ol' })).toEqual('/api/abc/xy/a/ol');
    expect(param1({ 1: 'xy' })).toEqual('/api/abc/xy/a/{2}');
    expect(param2({ 1: 'xy' })).toEqual('/api/abc');
    expect(param2({})).toEqual('/api/abc');
  });
});
