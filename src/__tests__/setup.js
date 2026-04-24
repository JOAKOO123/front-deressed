import "@testing-library/jest-dom";
import React from "react";

// Expone React globalmente para los archivos .jsx en el entorno de test
globalThis.React = React;

// Limpia localStorage entre cada test
beforeEach(() => {
  localStorage.clear();
});