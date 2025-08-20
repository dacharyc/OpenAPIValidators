declare module 'cartesian-product' {
  function cartesianProduct<T extends any[][]>(
    arrays: T,
  ): Array<{ [K in keyof T]: T[K][number] }>;
  export default cartesianProduct;
}
