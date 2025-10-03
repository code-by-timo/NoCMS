# Project Context

## Project Vision

**NoCMS** is a modern WordPress alternative that enables creation of static websites with an integrated CMS.

### Core Concept

- **Static Site Generation**: Build fast, secure static websites using SvelteKit
- **Git as CMS Backend**: All content changes are versioned and stored as Git commits
- **Admin Panel**: Web-based interface for content management that executes Git operations
- **PAT Authentication**: Secure access control using Personal Access Tokens
- **Iterative Development**: Built step-by-step to ensure robust functionality

### Architecture

The system works by:
1. Content editors use the admin frontend to manage content
2. Content changes trigger Git operations (commit, push) automatically
3. Git commits trigger static site rebuilds
4. The updated static site is deployed

### Benefits

- **Version Control**: Full content history through Git
- **Security**: PAT-based authentication, static site immunity to common web attacks
- **Performance**: Static sites are fast and scalable
- **Cost-Effective**: Minimal hosting requirements for static content
- **Developer-Friendly**: Familiar Git workflow, easy integration with existing tools

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
