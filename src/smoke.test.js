import { add } from './math';

describe('smoke test', () => {
  it('berjalan', () => {
    expect(add(1, 1)).toBe(2)
  })
})