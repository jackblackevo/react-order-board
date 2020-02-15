const debounce = <F extends (...args: any[]) => any>(func: F, wait = 300) => {
  let timeoutID = 0;

  return ((...args: Parameters<F>) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => func(...args), wait);
  }) as F;
};

export default debounce;
