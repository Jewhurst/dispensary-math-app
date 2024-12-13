# BudMath Dispensary Calculator

A simple, user-friendly web application that helps convert ounces to grams and calculate various dispensary measurement combinations. [Budmath.com](https://www.budmath.com)

## Features

- Convert ounces to grams
- Calculate different measurement combinations (ounces, halves, quarters, eighths, prerolls)
- Dark/Light mode toggle
- Calculation history
- Responsive design
- Mobile-friendly interface

## Technologies Used

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (Vanilla)
- Font Awesome Icons
- Local Storage for data persistence

## Installation

1. Clone the repository: 
```bash
git clone [your-repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Build the CSS:
```bash
npm run build
```

## Development

To watch for CSS changes during development:
```bash
npm run build
```

To build CSS for production:
```bash
npm run build:css
```

## Usage

1. Open `index.html` in your web browser
2. Enter the amount in ounces
3. Click "Calculate" to see the conversions
4. Toggle dark/light mode using the sun icon
5. View calculation history at the bottom

## Features in Detail

### Conversion Calculator
- Converts ounces to grams (1 oz = 28 grams)
- Displays individual measurement options
- Shows mixed combinations for flexible portioning

### Dark Mode
- Toggle between light and dark themes
- Persists user preference using localStorage

### History
- Saves last 5 calculations
- Displays timestamp for each calculation
- Click on history items to quickly recalculate

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Tailwind CSS for the utility-first CSS framework
- Font Awesome for the icons
