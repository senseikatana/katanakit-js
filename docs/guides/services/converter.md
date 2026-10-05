---
title: Converter
description: "Unit conversions for temperature, distance and weight, on top of the formatter."
---

# Converter

Decorates `FormatterService` with unit conversions.

```ts
import {
  useToCelsius, useToFahrenheit, useToMiles, useToKilos,
  useToCm, useToInches,
} from "katanakit-js";

useToCelsius(212);       // "100.00"
useToFahrenheit(100);    // "212.00"
useToMiles(10);          // ~"6.21" (km → miles)
useToKilos(10);          // pounds → kilos
useToCm(1);              // inches → cm
useToInches(2.54);       // cm → inches
```

---
