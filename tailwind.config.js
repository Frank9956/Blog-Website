/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // required for next-themes & shadcn
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // shadcn uses CSS variables from tailwind preset
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // You can optionally extend more here
      },
      borderRadius: {
        lg: 'var(--radius)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
