/**
 * @description Enumeration for different styles of query parameter serialization
 */
export enum QuerySerializerStyle {
  From = "form",
  SpaceDelimited = "spaceDelimited",
  PipeDelimited = "pipeDelimited",
  DeepObject = "deepObject",
}

/**
 * @description Define a type for query serialization parameters with different styles and explode options
 */
type QuerySerializationParamsVariant<
  Style extends QuerySerializerStyle,
  Explode extends boolean,
> = {
  style: Style;
  explode: Explode;
};

/**
 * @description Combine all possible query serialization parameters into a union type
 */
export type QuerySerializationParams =
  | QuerySerializationParamsVariant<
      Exclude<QuerySerializerStyle, QuerySerializerStyle.DeepObject>,
      boolean
    >
  | QuerySerializationParamsVariant<QuerySerializerStyle.DeepObject, true>;
