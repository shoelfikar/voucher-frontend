/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ===== Base / Neutral ===== */
        background: "#F5F7FA",
        surface: "#FFFFFF",
        muted: "#EEF2F6",
        border: "#E5E7EB",

        /* ===== Text ===== */
        text: {
          primary: "#1F2937",
          secondary: "#4B5563",
          muted: "#9CA3AF",
        },

        /* ===== Primary (CTA) ===== */
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1E40AF",
          soft: "#DBEAFE",
        },

        /* ===== Secondary ===== */
        secondary: {
          DEFAULT: "#E5E7EB",
          hover: "#D1D5DB",
          text: "#374151",
        },

        /* ===== Status ===== */
        success: {
          DEFAULT: "#16A34A",
          soft: "#DCFCE7",
        },
        error: {
          DEFAULT: "#DC2626",
          soft: "#FEE2E2",
        },
        warning: {
          DEFAULT: "#D97706",
          soft: "#FEF3C7",
        },
        info: {
          DEFAULT: "#0284C7",
          soft: "#E0F2FE",
        },

        /* ===== Table ===== */
        table: {
          header: "#F1F5F9",
          hover: "#F8FAFC",
        },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        lg: "12px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.05)",
        dropdown: "0 4px 12px rgba(0,0,0,0.08)",
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

