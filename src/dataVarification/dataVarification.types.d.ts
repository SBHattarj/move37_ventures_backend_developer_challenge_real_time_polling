export type Varifier<T> = (val: unknown, path: string[]) => T;

export type Schema<T> = {
    [Key in keyof T]: T[Key] extends Varifier<any> ? T[Key] : Schema<T[Key]>;
}

export type SchemaToObject<T extends Schema<any>> = T extends Varifier<infer Varified> ? Varified : {
    [Key in keyof T]: T[Key] extends Varifier<infer InnerVarified> ? InnerVarified : SchemaToObject<T[Key]>
}
