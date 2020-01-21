import debounce from '../debounce';

jest.useFakeTimers();

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should clearTimeout and setTimeout execution times same as debounced function', () => {
    const debouncedFunc = debounce(() => {});

    debouncedFunc();

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenLastCalledWith(expect.any(Number));

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300);

    Array.from({ length: 9 }).forEach(() => {
      debouncedFunc();
    });

    expect(clearTimeout).toHaveBeenCalledTimes(10);
    expect(clearTimeout).toHaveBeenLastCalledWith(expect.any(Number));

    expect(setTimeout).toHaveBeenCalledTimes(10);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300);
  });

  it('should callback execute after wait time', () => {
    const callback = jest.fn();
    const debouncedFunc = debounce(callback);

    debouncedFunc();

    expect(callback).not.toBeCalled();

    jest.runAllTimers();

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should callback execute once after execute debounced function multiple times during wait time', () => {
    const callback = jest.fn();
    const debouncedFunc = debounce(callback);

    Array.from({ length: 10 }).forEach(() => {
      debouncedFunc();
    });

    expect(callback).not.toBeCalled();

    jest.runAllTimers();

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should callback execute after 300ms when give 0 for wait time', () => {
    const callback = jest.fn();
    const debouncedFunc = debounce(callback);

    debouncedFunc();

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(100);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(200);

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should callback execute once after 300ms when give 0 for wait time and execute debounced function multiple times', () => {
    const callback = jest.fn();
    const debouncedFunc = debounce(callback);

    Array.from({ length: 10 }).forEach(() => {
      debouncedFunc();
    });

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(100);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(200);

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
