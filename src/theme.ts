import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
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
        fontWeight: 'semibold',
      },
    },
    Input: {
      baseStyle: {
        field: {
          _focus: {
            borderColor: 'blue.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
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
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});

export default theme; 