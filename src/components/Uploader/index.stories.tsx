require('dotenv').config()
import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import Uploader from "./index";

export default {
  title: "Uploader UI Library/Uploader",
  component: Uploader,
  parameters:{
    controls:{
      exclude:/.*/g
    }
  }
} as Meta<typeof Uploader>;

const Template: StoryFn<typeof Uploader> = (args) => <Uploader {...args} />;

export const UploaderArgs = Template.bind({});
console.log('Uploader starting in: ', process.env.UPLOADER_URL, process.env.UPLOADER_ACCOUNT);

UploaderArgs.args = { 
    uploader_url: process.env.UPLOADER_URL, 
    uploader_account: process.env.UPLOADER_ACCOUNT,
    infuraId: process.env.PUBLIC_INFURA_PROJECT_ID,
    walletConnectProjectId: process.env.PUBLIC_WALLETCONNECT_PROJECT_ID,
};