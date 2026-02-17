/**
 * Design System - Minimalist Bold Style
 * Inspired by clean, modern design with bold typography
 */

export const theme = {
    colors: {
        // Backgrounds
        background: '#FAFAFA',
        surface: '#FFFFFF',

        // Text
        textPrimary: '#000000',
        textSecondary: '#666666',
        textTertiary: '#999999',

        // Accent
        accent: '#000000',
        accentHover: '#333333',

        // Borders
        border: '#E5E5E5',
        borderLight: '#F0F0F0',

        // Status
        success: '#000000',
        warning: '#FF4444',
        error: '#FF4444',
    },

    typography: {
        // Font families
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

        // Font sizes
        hero: '96px',
        h1: '72px',
        h2: '48px',
        h3: '32px',
        h4: '24px',
        h5: '20px',
        body: '16px',
        small: '14px',
        tiny: '12px',

        // Font weights
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        black: 900,
    },

    spacing: {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '48px',
        xxl: '64px',
        xxxl: '96px',
    },

    borderRadius: {
        none: '0px',
        sm: '4px',
        md: '8px',
        lg: '12px',
    },

    shadows: {
        none: 'none',
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },

    transitions: {
        fast: '150ms ease',
        normal: '250ms ease',
        slow: '350ms ease',
    },
};

export default theme;
