import * as React from 'react'
import { render, screen } from '@testing-library/react'

import DBSUploader from './DBSUploader'

test('renders children', () => {
  const settings = [
    {
      title: 'IPFS',
      content: 'this is the content for the first tab'
    },
    {
      title: 'Arware',
      content: 'this is the content for the second tab'
    }
  ]
  render(<DBSUploader dbs_settings={settings}>Some Text</DBSUploader>)
  expect(screen.getByText('Some Text')).toHaveClass('DBSUploader')
})
