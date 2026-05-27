#!/usr/bin/env node
/**
 * Helper script para cálculos matemáticos precisos via mathjs.
 * Uso: node calculate.js "<expressão>"
 * Exemplo: node calculate.js "sqrt(2) * pi"
 */

const expression = process.argv[2];

if (!expression) {
  console.error("Uso: node calculate.js \"<expressão>\"");
  process.exit(1);
}

try {
  // Tenta usar mathjs se disponível no node_modules pai
  const math = require("mathjs");
  const result = math.evaluate(expression);
  console.log(String(result));
} catch (e) {
  // Fallback para eval seguro de expressões matemáticas simples
  try {
    const sanitized = expression
      .replace(/[^0-9+\-*/^().,%\s]/g, "")
      .replace(/\^/g, "**");
    const result = Function(`"use strict"; return (${sanitized})`)();
    console.log(String(result));
  } catch (evalErr) {
    console.error(`Erro ao calcular "${expression}": ${evalErr.message}`);
    process.exit(1);
  }
}
