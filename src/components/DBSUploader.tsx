import React, { ReactNode } from 'react'

import './DBSUploader.scss'

type Props = {
  children: ReactNode
}

const DBSUploader = ({ children }: Props) => {
  return <div className="DBSUploader">{children}</div>
}

export default DBSUploader
