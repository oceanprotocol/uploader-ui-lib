import React, { ReactElement } from 'react'
import { useSpring, animated } from 'react-spring'
import stylesTooltip from './index.module.css'
import Tippy, { TippyProps } from '@tippyjs/react/headless'

const animation = {
  config: { tension: 400, friction: 20 },
  from: { transform: 'scale(0.5) translateY(-3rem)' },
  to: { transform: 'scale(1) translateY(0)' }
}

// Forward ref for Tippy.js
// eslint-disable-next-line
const DefaultTrigger = React.forwardRef(() => {
  return <svg width="20" className={stylesTooltip.icon} height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M10 1.53846C5.32682 1.53846 1.53846 5.32682 1.53846 10C1.53846 14.6732 5.32682 18.4615 10 18.4615C14.6732 18.4615 18.4615 14.6732 18.4615 10C18.4615 5.32682 14.6732 1.53846 10 1.53846ZM0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM10 8.46154C10.4248 8.46154 10.7692 8.80593 10.7692 9.23077V15.3846C10.7692 15.8094 10.4248 16.1538 10 16.1538C9.57517 16.1538 9.23077 15.8094 9.23077 15.3846V9.23077C9.23077 8.80593 9.57517 8.46154 10 8.46154ZM10 4.61538C9.36275 4.61538 8.84615 5.13198 8.84615 5.76923C8.84615 6.40648 9.36275 6.92308 10 6.92308C10.6373 6.92308 11.1538 6.40648 11.1538 5.76923C11.1538 5.13198 10.6373 4.61538 10 4.61538Z"/>
</svg>

})

export default function Tooltip(props: TippyProps): ReactElement {
  const { className, ...restProps } = props
  const { content, children, trigger, disabled, placement } = props
  const [styles, api] = useSpring(() => animation.from)

  function onMount() {
    api.start({
      ...animation.to,
      onRest: (): void => {},
      config: animation.config
    })
  }

  function onHide({ unmount }: { unmount: () => void }) {
    api.start({
      ...animation.from,
      onRest: unmount,
      config: { ...animation.config, clamp: true }
    })
  }

  const styleClasses = `${stylesTooltip.tooltip} ${className || ''}`

  return (
    <Tippy
      interactive
      interactiveBorder={5}
      zIndex={3}
      trigger={trigger || 'mouseenter focus'}
      disabled={disabled || undefined}
      placement={placement || 'auto'}
      render={(attrs) => (
        <animated.div style={styles}>
          <div className={stylesTooltip.content} {...attrs}>
            {content}
            <div className={stylesTooltip.arrow} data-popper-arrow />
          </div>
        </animated.div>
      )}
      appendTo={
        typeof document !== 'undefined' && document.querySelector('body') || undefined
      }
      onMount={onMount}
      onHide={onHide}
      // animation
      {...restProps}
    >
      <div className={styleClasses}>{children || <DefaultTrigger />}</div>
    </Tippy>
  )
}
