# Project Guidance

## Overview

This is a minimal static HTML/CSS page. The browser entry point is `index.html`, which loads `stylesheets/main.css` using a relative path.

## Working Conventions

- Keep the project framework-free unless the task explicitly requires project setup.
- Preserve the HTML5 document structure, `lang`, charset, viewport metadata, and relative stylesheet link.
- Use semantic HTML and accessible text, labels, and interaction states as the page gains features.
- Match the existing style: four-space indentation in HTML and simple, readable CSS selectors.
- Keep structure in `index.html` and presentation in `stylesheets/main.css`; add JavaScript only when behavior requires it.

## Validation

There is no package manager, build step, test runner, or lint configuration. For browser validation, serve the repository root with:

```bash
python3 -m http.server
```

Then inspect `http://localhost:8000/` in a browser. Check that the page loads without console errors and that the stylesheet path remains valid.

## Scope

Avoid adding framework, dependency, or tooling files for small visual or markup changes. Update this file if the project gains a build system, tests, or a new application boundary.