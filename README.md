# Indian Sports Academy - Angular Frontend

A modern Angular application for Indian Sports Academy, a karate and martial arts training center in Salem, Tamil Nadu.

## Features

- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Multiple Pages**: Home, About, Classes, Gallery, Team, Contact
- **Clean Architecture**: Simple and maintainable Angular structure
- **Modern Styling**: SCSS with component-specific styles
- **Navigation**: Responsive header with mobile menu
- **Contact Form**: Interactive contact form with validation
- **Class Information**: Detailed class schedules and pricing

## Pages

1. **Home**: Hero section, features overview, class preview
2. **About**: Academy information, mission, values, facilities
3. **Classes**: Detailed class programs with schedules and pricing
4. **Gallery**: Image gallery with filtering by category
5. **Team**: Instructor profiles and expertise
6. **Contact**: Contact form and academy information

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/
│   │   └── footer/
│   ├── pages/
│   │   ├── home/
│   │   ├── about/
│   │   ├── classes/
│   │   ├── gallery/
│   │   ├── team/
│   │   └── contact/
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app.routes.ts
├── assets/
├── styles.scss
└── index.html
```

## Technologies Used

- **Angular 17**: Modern Angular framework
- **TypeScript**: Type-safe JavaScript
- **SCSS**: Enhanced CSS with variables and mixins
- **Angular Router**: Client-side routing
- **Angular Forms**: Form handling and validation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is the property of Indian Sports Academy.
