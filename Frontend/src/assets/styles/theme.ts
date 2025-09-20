export interface Theme {
    colors: {
        primary: string;
        secondary: string;
        success: string;
        danger: string;
        warning: string;
        light: string;
        dark: string;
        background: string;
        text: string;
        placeholder: string;
        lightGreen: string;
        borderColor: string;
        transperent: string;
        lightbg: string;
        diabled: string;
        white: string;
        pageColor: string;
        completedbg: string;
        pendingbg: string;
        inProcessbg: string;
        failedbg: string;
        completedText: string;
        pendingText: string;
        inProcessText: string;
        failedText: string;
    };
    fonts: {
        primary: string;
    };
    fontWeights: {
        regular: number;
        medium: number;
        semibold: number;
        bold: number;
    };
    fontSizes: {
        xxxl: string;
        xxl: string;
        xl: string;
        lg: string;
        md: string;
        base: string;
        sm: string;
        xs: string;
    };
    shadow: {
        shadowInput: string;
    };
    breakpoints: {
        values: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
        };
    };
}

export const theme: Theme = {
    colors: {
        primary: '#7B19D8',
        secondary: '#21786E',
        success: '#28a745',
        danger: '#FF5858',
        warning: '#ffc107',
        light: '#ffffff',
        dark: '#343A40',
        background: '#ffffff',
        text: '#434875',
        placeholder: '#a0a0a0ff',
        lightGreen: '#EDF3EC',
        borderColor: "#E0E0E0",
        transperent: '#00000000',
        lightbg: '#F9F7FD',
        diabled: '#f2f2f2',
        white: '#ffff',
        pageColor: '#F6F6F6',
        //bg
        completedbg: '#D9F6AC',
        pendingbg: '#F7F7B4',
        inProcessbg: '#C6E9F7',
        failedbg: '#F7D7D2',
        //text
        completedText: '#007C01',
        pendingText: '#F76331',
        inProcessText: '#0000F7',
        failedText: '#B52023',
    },
    fonts: {
        primary: 'Poppins, sans-serif',
    },
    fontSizes: {
        xxxl: '3.5rem',
        xxl: '3rem',
        xl: '1.75rem',
        lg: '1.5rem',
        md: '1.25rem',
        base: '1rem',
        sm: '0.875rem',
        xs: '0.75rem',
    },
    fontWeights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    shadow: {
        shadowInput: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
        },
    },
};
