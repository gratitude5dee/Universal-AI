
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				heading: ['"Neue Machina"', 'Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				studio: {
					cream: "#FFF8F0",
					sand: "#E8DCCA",
					clay: "#D2B48C",
					charcoal: "#36454F",
					accent: "#D98F64",
					highlight: "#F9D7C0"
				},
				// Enhanced blue theme colors with better contrast
				blue: {
					darker: "#1a2d69", // Darkened for better contrast
					dark: "#1e40af",
					primary: "#3b82f6",
					light: "#60a5fa",
					lighter: "#93c5fd",
					lightest: "#dbeafe",
				},
				// New futuristic color palette
				futuristic: {
					base: 'var(--color-base-deep)',
					baseLighter: 'var(--color-base-deep-lighter)',
					baseDarker: 'var(--color-base-deep-darker)',
					accent: 'var(--color-accent-primary)',
					accentLighter: 'var(--color-accent-primary-lighter)',
					accentDarker: 'var(--color-accent-primary-darker)',
					highlight: 'var(--color-highlight-interactive)',
					highlightLighter: 'var(--color-highlight-interactive-lighter)',
					highlightDarker: 'var(--color-highlight-interactive-darker)',
					coolGray: 'var(--color-neutral-cool-gray)',
					coolGrayLighter: 'var(--color-neutral-cool-gray-lighter)',
					coolGrayDarker: 'var(--color-neutral-cool-gray-darker)'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-slow': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'soft-pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'breathing': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.03)' }
				},
				'cloud-drift': {
					'0%, 100%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(5%)' }
				},
				'cloud-drift-alt': {
					'0%, 100%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(-5%)' }
				},
				'glow-pulse': {
					'0%, 100%': { opacity: '0.8' },
					'50%': { opacity: '0.6' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-in-slow': 'fade-in-slow 1.2s ease-out forwards',
				'slide-up': 'slide-up 0.5s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
				'soft-pulse': 'soft-pulse 3s infinite ease-in-out',
				'float': 'float 6s infinite ease-in-out',
				'scale-in': 'scale-in 0.3s ease-out forwards',
				'breathing': 'breathing 8s infinite ease-in-out',
				'cloud-drift': 'cloud-drift 60s infinite ease-in-out',
				'cloud-drift-alt': 'cloud-drift-alt 70s infinite ease-in-out',
				'glow-pulse': 'glow-pulse 8s infinite ease-in-out'
			},
			boxShadow: {
				'subtle': '0 2px 10px rgba(0, 0, 0, 0.05)',
				'elevation': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
				'inner-glow': 'inset 0 0 10px rgba(255, 255, 255, 0.5)',
				'blue-glow': '0 0 15px rgba(59, 130, 246, 0.5)',
				'card-glow': '0 4px 20px -2px rgba(30, 64, 175, 0.25)',
				'accent-glow': '0 0 20px rgba(255, 107, 0, 0.5)',
				'highlight-glow': '0 0 20px rgba(0, 240, 255, 0.5)'
			},
			backgroundImage: {
				'blue-gradient': 'linear-gradient(135deg, #1a2d69 0%, #1e40af 100%)',
				'blue-card': 'linear-gradient(to bottom right, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.3))',
				'sidebar-gradient': 'linear-gradient(to bottom, #1a2d69, #1e40af)',
				'card-gradient': 'linear-gradient(to bottom right, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.2))',
				'futuristic-gradient': 'linear-gradient(135deg, var(--color-base-deep) 0%, var(--color-base-deep-lighter) 100%)',
				'accent-gradient': 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-primary-lighter) 100%)',
				'highlight-gradient': 'linear-gradient(135deg, var(--color-highlight-interactive) 0%, var(--color-highlight-interactive-lighter) 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
