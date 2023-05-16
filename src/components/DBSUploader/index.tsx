import React from 'react'

import '../../stylesGlobal/styles.css'
import './index.module.css'
import TabsFile from '../TabsFile'

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
