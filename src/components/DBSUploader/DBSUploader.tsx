import React, { ReactNode } from 'react'

import './DBSUploader.css'
import TabsFile from '@components/TabsFile'

type dbs_setting = {
  title: string,
  content: string
}

type Props = {
  dbs_settings: dbs_setting[]
}

const DBSUploader = ({ dbs_settings }: Props) => {

  return (
    <div className="DBSUploader"> 
      <TabsFile items={dbs_settings as any} />
    </div>
  )
}

export default DBSUploader
