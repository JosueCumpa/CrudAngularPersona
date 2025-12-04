import { startApp } from './main';

describe('main.ts startApp', () => {
  it('should initialize federation and load bootstrap', async () => {
    const initSpy = jasmine.createSpy('init').and.resolveTo(undefined);
    const loaderSpy = jasmine.createSpy('loader').and.resolveTo(undefined);

    await startApp(initSpy, loaderSpy);

    expect(initSpy).toHaveBeenCalledWith('federation.manifest.json');
    expect(loaderSpy).toHaveBeenCalled();
  });

  it('should log error when startup fails', async () => {
    const error = new Error('boom');
    const initSpy = jasmine.createSpy('init').and.rejectWith(error);
    const loaderSpy = jasmine.createSpy('loader');
    const consoleSpy = spyOn(console, 'error');

    await startApp(initSpy, loaderSpy);

    expect(consoleSpy).toHaveBeenCalled();
    expect(loaderSpy).not.toHaveBeenCalled();
  });
});
