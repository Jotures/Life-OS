/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                zinc: {
                    950: '#09090b',
                    900: '#18181b',
                    800: '#27272a',
                    700: '#3f3f46',
                    600: '#52525b',
                    500: '#71717a',
                    400: '#a1a1aa',
                    300: '#d4d4d8',
                    200: '#e4e4e7',
                    100: '#f4f4f5',
                }
            },
            animation: {
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                // Entry animations
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.4s ease-out forwards',
                'slide-in-right': 'slideInRight 0.4s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
                'scale-bounce': 'scaleBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                // Micro-interactions
                'pop': 'pop 0.2s ease-out',
                'wiggle': 'wiggle 0.5s ease-in-out',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'checkmark': 'checkmark 0.3s ease-out forwards',
                // Tab transitions
                'tab-enter': 'tabEnter 0.3s ease-out forwards',
                // Stagger delays (use with animation-delay utilities)
                'stagger-1': 'fadeInUp 0.4s ease-out 0.05s forwards',
                'stagger-2': 'fadeInUp 0.4s ease-out 0.1s forwards',
                'stagger-3': 'fadeInUp 0.4s ease-out 0.15s forwards',
                'stagger-4': 'fadeInUp 0.4s ease-out 0.2s forwards',
                'stagger-5': 'fadeInUp 0.4s ease-out 0.25s forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(-24px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(24px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                scaleBounce: {
                    '0%': { opacity: '0', transform: 'scale(0.8)' },
                    '60%': { transform: 'scale(1.05)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pop: {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(0.95)' },
                    '100%': { transform: 'scale(1)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(251, 191, 36, 0)' },
                    '50%': { boxShadow: '0 0 20px 4px rgba(251, 191, 36, 0.3)' },
                },
                checkmark: {
                    '0%': { transform: 'scale(0) rotate(-45deg)' },
                    '50%': { transform: 'scale(1.2) rotate(0deg)' },
                    '100%': { transform: 'scale(1) rotate(0deg)' },
                },
                tabEnter: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
