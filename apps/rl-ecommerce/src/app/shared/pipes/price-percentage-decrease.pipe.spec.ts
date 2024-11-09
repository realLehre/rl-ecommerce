import { PricePercentageDecreasePipe } from './price-percentage-decrease.pipe';

describe('PricePercentageDecreasePipe', () => {
  it('create an instance', () => {
    const pipe = new PricePercentageDecreasePipe();
    expect(pipe).toBeTruthy();
  });
});
