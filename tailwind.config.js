module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: 'var(--primary)',
                secondary: 'var(--secondary)',
                accent: 'var(--accent)',
                textPrimary: 'var(--foreground)',
                textSecondary: 'var(--background)',
                border: 'var(--foreground)',
            },
        },
    },
    plugins: [],
};