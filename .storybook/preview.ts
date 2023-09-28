import '@oceanprotocol/typographies/css/ocean-typo.css'

export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'dark', value: 'rgb(10, 10, 10)' },
      { name: 'light', value: '#fcfcfc' }
    ]
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /date$/
    }
  },
  options: {
    showRoots: false, // Hides the root in the sidebar
    showPanel: false, // Hides the addon panel at the bottom
  },
  toolbars: {
    previewActions: {
      hidden: true, // Hides the top toolbar (with the 'show code' button, etc.)
    },
  }
}
