# Project Context

## Tech Stack

This is a SvelteKit application with the following configuration:

- **SvelteKit** with `@sveltejs/adapter-static` for static site generation
- **Svelte 5** (using the latest runes API - see `svelte-llms.txt`)
- **Tailwind CSS v4** configured via `app.css`
- **shadcn-svelte** for UI components

## Important Guidelines

### Svelte 5 Reference

**Always** consult `svelte-llms.txt` when working with Svelte components. This file contains comprehensive documentation about:
- Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`)
- SvelteKit routing and data loading
- Snippets and component patterns
- Forms and actions

### Design System Consistency

**Always** maintain design system consistency following shadcn-svelte conventions:

1. **Use the Tailwind theme variables** defined in `app.css`
2. **Follow shadcn-svelte component patterns** for all UI elements
3. **Leverage CSS variables** for colors (e.g., `background`, `foreground`, `primary`, `secondary`, etc.)
4. **Maintain consistent spacing, typography, and component structure**

When creating or modifying components:
- Check existing shadcn-svelte components in `src/lib/components/ui/`
- Use theme variables instead of hardcoded colors
- Follow the established component composition patterns
- Ensure responsive design and accessibility

This ensures a cohesive, maintainable design system throughout the application.
