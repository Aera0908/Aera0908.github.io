# Web Resume - Aira Ynte

An interactive, modern web resume built with React, TypeScript, and TailwindCSS. Featuring smooth animations, hover effects, and a beautiful gradient design.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## Features

-  **Modern UI/UX** - Beautiful gradient backgrounds with glassmorphism effects
-  **Interactive Elements** - Smooth animations, hover effects, and transitions
-  **Fully Responsive** - Mobile-first design that works on all devices
-  **Fast Performance** - Built with Vite for lightning-fast load times
-  **Type-Safe** - Written in TypeScript for better code quality
-  **Custom Animations** - Tailwind custom animations for engaging user experience

## Project Structure

```
web_resume/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx       # Responsive navigation bar
│   │   ├── Hero.tsx         # Hero section with intro
│   │   ├── About.tsx        # About me section
│   │   ├── Education.tsx    # Education history
│   │   ├── Skills.tsx       # Tech stack & skills
│   │   ├── Certifications.tsx # Certificates
│   │   └── Contact.tsx      # Contact & social links
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aera0908/web_resume.git
   cd web_resume
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment to GitHub Pages

### Method 1: Using GitHub Actions (Recommended)

This project is configured with GitHub Actions for automatic deployment.

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/Aera0908/web_resume.git
   git push -u origin main
   ```

2. **Configure GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy on every push to `main`

3. **Access your site**
   - Your site will be available at: `https://Aera0908.github.io/web_resume/`

### Method 2: Manual Deployment with gh-pages

```bash
npm run deploy
```

This will build the project and deploy to the `gh-pages` branch.

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Icons** - Icon library for beautiful social media icons
- **Framer Motion** - Animation library (if needed)

## Customization

### Update Personal Information

Edit the content in each component file:
- `src/components/Hero.tsx` - Update name, title, introduction
- `src/components/About.tsx` - Update background and expertise
- `src/components/Education.tsx` - Update education history
- `src/components/Skills.tsx` - Update tech stack
- `src/components/Certifications.tsx` - Update certificates
- `src/components/Contact.tsx` - Update contact information

### Change Colors

Modify `tailwind.config.js` to customize the color scheme:
```js
theme: {
  extend: {
    colors: {
      // Add custom colors here
    }
  }
}
```

### Update Profile Photo

The profile photo is already set up! It uses `/ynte_pic.jpg` from the `public/` folder.

To change it, simply replace `public/ynte_pic.jpg` with your new photo, or update the path in `src/components/Hero.tsx`:
```tsx
<img
  src="/ynte_pic.jpg"  // Your current photo
  alt="Aira Ynte"
  className="w-48 h-48 rounded-full..."
/>
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to GitHub Pages |

## Troubleshooting

### Issue: Blank page after deployment

**Solution:** Make sure the `base` in `vite.config.ts` matches your repository name:
```ts
export default defineConfig({
  base: '/web_resume/',  // Must match repo name
})
```

### Issue: 404 errors on GitHub Pages

**Solution:** Ensure GitHub Pages is configured to use GitHub Actions or the correct branch.

## License

This project is open source and available under the MIT License.

## Author

**Aira Ynte**

- LinkedIn: [Aira Ynte](https://linkedin.com/in/aira-josh-ynte-755353322)
- Instagram: [@area0908](https://instagram.com/area0908)
- Email: 08airajosh@gmail.com
- GitHub: [@Aera0908](https://github.com/Aera0908)
- Discord: aeradynamics

## Acknowledgments

- Design inspiration from modern portfolio websites
- Social media icons from [react-icons](https://react-icons.github.io/react-icons/)
- Badges from [shields.io](https://shields.io)

---

 **Star this repository if you found it helpful!**

