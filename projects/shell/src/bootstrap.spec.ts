import { bootstrapApp } from './bootstrap';

describe('bootstrap.ts bootstrapApp', () => {
  it('should bootstrap the application', async () => {
    const bootstrapFn = jasmine.createSpy('bootstrapFn').and.resolveTo(undefined as any);

    await bootstrapApp(bootstrapFn);

    expect(bootstrapFn).toHaveBeenCalled();
  });

  it('should log error on bootstrap failure', async () => {
    const error = new Error('bootstrap failed');
    const bootstrapFn = jasmine.createSpy('bootstrapFn').and.rejectWith(error);
    const consoleSpy = spyOn(console, 'error');

    await bootstrapApp(bootstrapFn);

    expect(consoleSpy).toHaveBeenCalled();
  });
});
