import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    multiversx: {
      50: '#e6f7f5',
      100: '#b3e8e3',
      200: '#80d9d1',
      300: '#4dcabf',
      400: '#1abbbd',
      500: '#23f7dd',
      600: '#1cc5b0',
      700: '#159383',
      800: '#0e6256',
      900: '#073129',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  components: {
    Tabs: {
      baseStyle: {
        tablist: {
          borderBottom: '1px solid',
          borderColor: 'gray.200',
        },
        tab: {
          _selected: {
            color: 'blue.500',
            borderColor: 'blue.500',
          },
        },
      },
    },
    List: {
      baseStyle: {
        container: {
          spacing: 4,
        },
      },
    },
    ListItem: {
      baseStyle: {
        container: {
          p: 4,
          borderWidth: '1px',
          borderRadius: 'md',
        },
      },
    },
    Box: {
      baseStyle: {
        p: 4,
        w: '100%',
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'multiversx.500',
          color: 'black',
          _hover: {
            bg: 'multiversx.600',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: 'gray.800',
          color: 'white',
          _focus: {
            borderColor: 'multiversx.500',
          },
        },
      },
    },
    Textarea: {
      baseStyle: {
        field: {
          _focus: {
            borderColor: 'blue.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
      },
    },
  },
});

export default theme; 