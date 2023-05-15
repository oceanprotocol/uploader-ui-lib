import React, { ReactNode } from 'react'

import './DBSUploader.css'

type Props = {
  children: ReactNode
}

const DBSUploader = ({ children }: Props) => {




  return <div className="DBSUploader">
    <div>Testing UPdates</div>
    {children}
  </div>
}

export default DBSUploader
