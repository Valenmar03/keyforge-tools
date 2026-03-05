export function estimateEntropyBitsFromPool(poolSize: number, length: number) {
    if (!poolSize || poolSize <= 1 || !length) return 0;
    return Math.log2(poolSize) * length;
  }