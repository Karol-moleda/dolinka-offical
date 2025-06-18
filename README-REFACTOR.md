# Dolinka Website

This project is a React-based website for Dolinka organization.

## Project Structure

The project has been refactored to follow modern React practices with a clean folder structure:

```
src/
  ├── components/      # React components
  ├── context/         # Context providers (theme, etc.)
  ├── data/            # JSON data files
  ├── styles/          # Styled components and CSS files
  │    ├── base/       # Global styles and baseline CSS
  │    └── components/ # Component-specific styles
  └── App.jsx          # Main application component
```

## Key Features

- **Modern React with Hooks and Context API**: Uses functional components and hooks for state management
- **Code Splitting**: Uses React.lazy for improved performance
- **Theming**: Light and dark mode support
- **Accessibility Features**: Font size adjustment and contrast improvements
- **Responsive Design**: Mobile-friendly layout

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Component Structure

- `App.jsx`: Main entry point
- `ThemeContext.jsx`: Manages theme and accessibility settings
- Main Section Components:
  - `navigation.jsx`: Top navigation bar
  - `header.jsx`: Hero section
  - `about.jsx`: About section
  - `services.jsx`: Services section
  - `features.jsx`: Features section
  - `gallery.jsx`: Gallery section
  - `Team.jsx`: Team members section
  - `contact.jsx`: Contact information and form

## Styling System

- **Global Styles**: Base styling in `styles/base/GlobalStyles.jsx`
- **Component Specific**: Component styling in `styles/components/`
- **Theme Support**: Dark/light mode via context provider
- **Legacy Support**: Important CSS fixes maintained in `LegacyFixes.css`

## Accessibility Features

- Dark mode toggle
- Font size adjustment
- High contrast support
- Screen reader friendly markup

## Future Improvements

- Consider using TypeScript for better type safety
- Add more comprehensive testing
- Consider migrating to a more modern routing solution if needed
- Further optimize images and assets for performance
