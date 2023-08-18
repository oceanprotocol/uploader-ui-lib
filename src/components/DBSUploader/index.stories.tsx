require('dotenv').config()
import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import DBSUploader from "./index";

export default {
  title: "DBS UI Library/DBSUploader",
  component: DBSUploader,
  parameters:{
    controls:{
      exclude:/.*/g
    }
  }
} as Meta<typeof DBSUploader>;

const Template: StoryFn<typeof DBSUploader> = (args) => <DBSUploader {...args} />;

export const dbsUploader = Template.bind({});
dbsUploader.args = {
    dbs_url: process.env.DBS_URL,
    dbs_account: process.env.DBS_ACCOUNT,
    infuraId: process.env.PUBLIC_INFURA_PROJECT_ID,
    walletConnectProjectId: process.env.PUBLIC_WALLETCONNECT_PROJECT_ID,
};