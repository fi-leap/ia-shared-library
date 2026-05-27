import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as math from "mathjs";

export function registerMathTools(server: McpServer): void {
  server.tool(
    "calculate",
    "Evaluate a mathematical expression with full precision. Supports arithmetic, algebra, trigonometry, logarithms, and more.",
    {
      expression: z
        .string()
        .describe(
          "Mathematical expression to evaluate. Examples: '2^10', 'sqrt(144)', 'sin(pi/2)', '15% * 200', 'factorial(10)'"
        ),
    },
    async ({ expression }) => {
      try {
        const result = math.evaluate(expression);
        const formatted =
          typeof result === "number"
            ? math.format(result, { precision: 14 })
            : String(result);
        return {
          content: [
            {
              type: "text",
              text: formatted,
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "statistics",
    "Compute descriptive statistics on a dataset of numbers.",
    {
      data: z.array(z.number()).describe("Array of numbers to analyze"),
      operations: z
        .array(
          z.enum([
            "mean",
            "median",
            "mode",
            "std",
            "variance",
            "min",
            "max",
            "sum",
            "count",
          ])
        )
        .describe("Statistical operations to compute"),
    },
    async ({ data, operations }) => {
      try {
        if (data.length === 0) {
          return {
            content: [{ type: "text", text: "Error: dataset is empty" }],
            isError: true,
          };
        }

        const results: Record<string, number | number[]> = {};

        for (const op of operations) {
          switch (op) {
            case "mean":
              results.mean = math.mean(data) as number;
              break;
            case "median":
              results.median = math.median(data) as number;
              break;
            case "mode":
              results.mode = math.mode(data) as number[];
              break;
            case "std":
              results.std = math.std(data, "uncorrected") as number;
              break;
            case "variance":
              results.variance = math.variance(data, "uncorrected") as number;
              break;
            case "min":
              results.min = math.min(data) as number;
              break;
            case "max":
              results.max = math.max(data) as number;
              break;
            case "sum":
              results.sum = math.sum(data) as number;
              break;
            case "count":
              results.count = data.length;
              break;
          }
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "solve_equation",
    "Solve a mathematical equation for a given variable. Supports linear and quadratic equations.",
    {
      equation: z
        .string()
        .describe(
          "Equation to solve. Use '=' to separate left and right sides. Examples: 'x^2 - 4 = 0', '2*x + 5 = 13', 'x^2 + 2*x + 1 = 0'"
        ),
      variable: z
        .string()
        .default("x")
        .describe("Variable to solve for (default: 'x')"),
    },
    async ({ equation, variable }) => {
      try {
        const parts = equation.split("=");
        if (parts.length !== 2) {
          return {
            content: [
              {
                type: "text",
                text: "Error: equation must contain exactly one '=' sign",
              },
            ],
            isError: true,
          };
        }

        const lhs = parts[0].trim();
        const rhs = parts[1].trim();
        // Rewrite as f(x) = 0: lhs - rhs = 0
        const expr = `(${lhs}) - (${rhs})`;

        const parsed = math.parse(expr);
        const compiled = parsed.compile();

        // Determine degree by checking coefficients
        const solutions: string[] = [];

        // Try to identify if linear or quadratic
        const scope: Record<string, number> = {};

        // Quadratic: evaluate at 3 points to find a, b, c
        scope[variable] = 0;
        const c = compiled.evaluate(scope) as number;
        scope[variable] = 1;
        const f1 = compiled.evaluate(scope) as number;
        scope[variable] = -1;
        const fm1 = compiled.evaluate(scope) as number;

        const a = (f1 + fm1 - 2 * c) / 2;
        const b = (f1 - fm1) / 2;

        if (Math.abs(a) < 1e-10) {
          // Linear: b*x + c = 0
          if (Math.abs(b) < 1e-10) {
            return {
              content: [
                {
                  type: "text",
                  text:
                    Math.abs(c) < 1e-10
                      ? "Infinite solutions (identity)"
                      : "No solution",
                },
              ],
            };
          }
          const sol = -c / b;
          solutions.push(
            `${variable} = ${math.format(sol, { precision: 10 })}`
          );
        } else {
          // Quadratic: a*x^2 + b*x + c = 0
          const discriminant = b * b - 4 * a * c;
          if (discriminant > 0) {
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            solutions.push(`${variable} = ${math.format(x1, { precision: 10 })}`);
            solutions.push(`${variable} = ${math.format(x2, { precision: 10 })}`);
          } else if (Math.abs(discriminant) < 1e-10) {
            const x1 = -b / (2 * a);
            solutions.push(
              `${variable} = ${math.format(x1, { precision: 10 })} (double root)`
            );
          } else {
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-discriminant) / (2 * a);
            solutions.push(
              `${variable} = ${math.format(realPart, { precision: 6 })} + ${math.format(imagPart, { precision: 6 })}i`
            );
            solutions.push(
              `${variable} = ${math.format(realPart, { precision: 6 })} - ${math.format(imagPart, { precision: 6 })}i`
            );
          }
        }

        return {
          content: [
            {
              type: "text",
              text: solutions.join("\n"),
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
