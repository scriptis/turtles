export interface AsBytes {
  asBytes(): string,
}

export interface FromBytes {
  fromBytes(bytes: string): this,
}
