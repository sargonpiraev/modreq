import type { Preview } from '@storybook/react-vite'

import { MODREQ_POPUP_HEIGHT, MODREQ_POPUP_WIDTH } from '@repo/ui/modreq/layout'

import './tailwind.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'popup',
      values: [{ name: 'popup', value: 'oklch(0.16 0.01 260)' }],
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    (Story, { parameters }) => {
      if (parameters.skipShotDecorator) {
        return <Story />;
      }

      return (
        <div
          id="shot"
          className="dark overflow-hidden bg-background text-foreground"
          style={{
            width: MODREQ_POPUP_WIDTH,
            minWidth: MODREQ_POPUP_WIDTH,
            maxWidth: MODREQ_POPUP_WIDTH,
            height: MODREQ_POPUP_HEIGHT,
            minHeight: MODREQ_POPUP_HEIGHT,
            maxHeight: MODREQ_POPUP_HEIGHT,
          }}
        >
          <div className="h-full">
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;
