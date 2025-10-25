import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}"
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
				orbitron: ['Orbitron', 'sans-serif'],
				roboto: ['Roboto', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
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
				},
				neon: {
					purple: 'hsl(var(--neon-purple))',
					cyan: 'hsl(var(--neon-cyan))',
					pink: 'hsl(var(--neon-pink))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'neon-pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.6' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'gradient-shift': {
					'0%, 100%': { 
						backgroundPosition: '0% 50%',
						filter: 'brightness(1) drop-shadow(0 0 8px hsl(var(--neon-purple)))'
					},
					'25%': { 
						backgroundPosition: '50% 50%',
						filter: 'brightness(1.2) drop-shadow(0 0 12px hsl(var(--neon-cyan)))'
					},
					'50%': { 
						backgroundPosition: '100% 50%',
						filter: 'brightness(1) drop-shadow(0 0 8px hsl(var(--neon-pink)))'
					},
					'75%': { 
						backgroundPosition: '50% 50%',
						filter: 'brightness(1.2) drop-shadow(0 0 12px hsl(var(--neon-cyan)))'
					}
				},
				'fall': {
					'0%': { 
						transform: 'translateY(-10px) translateX(0)',
						opacity: '0'
					},
					'10%': {
						opacity: '1'
					},
					'90%': {
						opacity: '1'
					},
					'100%': { 
						transform: 'translateY(100vh) translateX(20px)',
						opacity: '0'
					}
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(var(--neon-purple)), 0 0 40px hsl(var(--neon-purple)), 0 0 60px hsl(var(--neon-purple))',
						transform: 'scale(1)'
					},
					'50%': {
						boxShadow: '0 0 30px hsl(var(--neon-pink)), 0 0 60px hsl(var(--neon-pink)), 0 0 90px hsl(var(--neon-pink))',
						transform: 'scale(1.05)'
					}
				},
				'rainbow-border': {
					'0%': {
						borderColor: 'hsl(var(--neon-purple))'
					},
					'33%': {
						borderColor: 'hsl(var(--neon-cyan))'
					},
					'66%': {
						borderColor: 'hsl(var(--neon-pink))'
					},
					'100%': {
						borderColor: 'hsl(var(--neon-purple))'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'gradient-shift': 'gradient-shift 4s ease-in-out infinite',
				'fall': 'fall linear infinite',
				'glow-pulse': 'glow-pulse 1.5s ease-in-out infinite',
				'rainbow-border': 'rainbow-border 3s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;