import type { Config } from 'tailwindcss';

/**
 * CarePilot design tokens.
 * The palette is carried over from the original static CarePilot site so the
 * rebuilt platform keeps its identity: warm paper background, deep ink text,
 * teal primary, coral accent, mint/yellow support colours.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#193b3a',
        soft: '#486260',
        muted: '#708482',
        paper: '#fffdf9',
        cream: '#f6f5ef',
        mint: { DEFAULT: '#dcefe7', deep: '#b9dfcf' },
        teal: { DEFAULT: '#126d67', deep: '#0b5551', soft: '#e3f1ee' },
        coral: { DEFAULT: '#ef9075', soft: '#ffe3d8' },
        sun: '#f7d875',
        line: '#dbe5df',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Segoe UI', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      fontSize: {
        display: ['clamp(2.75rem, 5.4vw, 4.75rem)', { lineHeight: '1.0', letterSpacing: '-0.075em' }],
        'display-sm': ['clamp(2rem, 3.4vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.05em' }],
      },
      borderRadius: {
        card: '16px',
        panel: '22px',
      },
      boxShadow: {
        card: '0 10px 30px rgba(25, 59, 58, 0.08)',
        lifted: '0 22px 60px rgba(25, 59, 58, 0.12)',
      },
      maxWidth: {
        shell: '1180px',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
