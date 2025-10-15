import { JSONSchema } from "../types";

function normalizeType(type: string | string[] | undefined): string[] {
  if (!type) return ["object", "array", "string", "number", "integer", "boolean", "null"];
  return Array.isArray(type) ? type : [type];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateInternal(
  schema: JSONSchema,
  value: unknown,
  path: string,
  errors: string[]
) {
  const expectedTypes = normalizeType(schema.type);
  const matchesType = expectedTypes.some((expected) => {
    switch (expected) {
      case "object":
        return isObject(value);
      case "array":
        return Array.isArray(value);
      case "string":
        return typeof value === "string";
      case "number":
        return typeof value === "number";
      case "integer":
        return typeof value === "number" && Number.isInteger(value);
      case "boolean":
        return typeof value === "boolean";
      case "null":
        return value === null;
      default:
        return true;
    }
  });

  if (!matchesType) {
    errors.push(`${path} expected type ${expectedTypes.join(" | ")}`);
    return;
  }

  if (expectedTypes.includes("object") && isObject(value)) {
    const obj = value;
    const required = schema.required ?? [];
    for (const key of required) {
      if (!(key in obj)) {
        errors.push(`${path}.${key} is required`);
      }
    }
    const properties = schema.properties ?? {};
    for (const [key, propertySchema] of Object.entries(properties)) {
      if (key in obj) {
        validateInternal(propertySchema, obj[key], `${path}.${key}`, errors);
      }
    }
    const additional = schema.additionalProperties;
    if (additional === false) {
      for (const key of Object.keys(obj)) {
        if (!properties[key]) {
          errors.push(`${path}.${key} is not allowed`);
        }
      }
    } else if (additional && additional !== true) {
      for (const key of Object.keys(obj)) {
        if (!properties[key]) {
          validateInternal(additional as JSONSchema, obj[key], `${path}.${key}`, errors);
        }
      }
    }
  }

  if (expectedTypes.includes("array") && Array.isArray(value) && schema.items) {
    if (Array.isArray(schema.items)) {
      value.forEach((item, index) => {
        const itemSchema = schema.items![Math.min(index, schema.items!.length - 1)];
        validateInternal(itemSchema, item, `${path}[${index}]`, errors);
      });
    } else {
      value.forEach((item, index) => {
        validateInternal(schema.items as JSONSchema, item, `${path}[${index}]`, errors);
      });
    }
  }

  if (expectedTypes.some((t) => t === "string") && typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${path} must have minLength ${schema.minLength}`);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push(`${path} must have maxLength ${schema.maxLength}`);
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${path} must match pattern ${schema.pattern}`);
    }
  }

  if (
    expectedTypes.some((t) => t === "number" || t === "integer") &&
    typeof value === "number"
  ) {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${path} must be >= ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`${path} must be <= ${schema.maximum}`);
    }
    if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) {
      errors.push(`${path} must be > ${schema.exclusiveMinimum}`);
    }
    if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) {
      errors.push(`${path} must be < ${schema.exclusiveMaximum}`);
    }
  }

  if (schema.enum && !schema.enum.includes(value as never)) {
    errors.push(`${path} must be one of ${schema.enum.join(", ")}`);
  }
}

export function validateSchema(schema: JSONSchema, value: unknown): string[] {
  const errors: string[] = [];
  validateInternal(schema, value, "$", errors);
  return errors;
}

export function assertSchema(
  schema: JSONSchema,
  value: unknown,
  schemaName: string
): asserts value is Record<string, unknown> {
  const errors = validateSchema(schema, value);
  if (errors.length > 0) {
    throw new Error(`${schemaName} validation failed: ${errors.join("; ")}`);
  }
}
