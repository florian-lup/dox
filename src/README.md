# Project Structure

This project follows Next.js best practices for directory structure and organization.

## Directory Structure

- `app/`: Contains the Next.js App Router pages and API routes

  - `api/`: Server-side API routes
  - `page.tsx`: Main page component
  - `layout.tsx`: Root layout component

- `components/`: UI components organized by domain and purpose

  - `features/`: Domain-specific feature components
    - `terminal/`: Terminal feature components
  - `ui/`: Reusable UI components
  - `layouts/`: Layout components

- `lib/`: Shared utilities, services, and types

  - `contexts/`: React context providers
  - `services/`: Service modules for external APIs
  - `types/`: TypeScript type definitions
  - `utils/`: Utility functions

- `public/`: Static assets

## Best Practices

1. **Component Organization**: Components are organized by domain and purpose
2. **Barrel Exports**: Index files are used to simplify imports
3. **App Router**: Next.js App Router is used for routing
4. **API Routes**: API routes are organized by domain
5. **Shared Code**: Shared code is placed in the `lib` directory
