# Project Templates Repository

This repository is designed to store and maintain templates for various types of projects, including frontend, backend, and service architectures.

## How This Repository Works
`
- **`main` branch:** Contains only this README file. No template code is present here.
- **Template branches:** Each project template has its own dedicated branch (e.g., `react-with-vite-shadcn`, `express-api-template`, etc.).

## Why This Structure?

- **Separation:** Each template is isolated in its own branch, avoiding conflicts and making maintenance easier.
- **Clarity:** The main branch remains clean, serving as a landing page and guide for repository usage.
- **Scalability:** Easily add new templates by creating new branches without affecting existing ones.

## Available Templates

- `react-with-vite-shadcn`: React + Vite + shadcn/ui starter
- *(More templates coming soon!)*

## How to Use a Template

1. **List all branches:**
   ```sh
   git branch -r
   ```
2. **Checkout the desired template branch:**
   ```sh
   git checkout origin/<template-branch-name> -b my-new-project
   ```
3. **Start building your project!**

