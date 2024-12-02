export type LiteralKeyedObject<K extends string, V> = { [key in K]: V };

export type KeysOfType<TTarget, TValue = any> = {
  [K in keyof TTarget]: TTarget[K] extends TValue ? K : never;
}[keyof TTarget];

export type UndefinableKeysOfType<T, U> = {
  [K in keyof T]-?: NonNullable<T[K]> extends U ? K : never;
}[keyof T];

export type ObjectWithStringKeys<T> = {
  [K in keyof T]: string;
};
