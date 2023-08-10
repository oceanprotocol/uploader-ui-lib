require('dotenv').config()
import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import Web3Connection from "./index";

export default {
  title: "DBS UI Library/DBSComponent",
  component: Web3Connection,
} as Meta<typeof Web3Connection>;

const Template: StoryFn<typeof Web3Connection> = (args) => <Web3Connection {...args} />;

export const web3Connection = Template.bind({});
web3Connection.args = {
    dbs_url: process.env.DBS_URL,
    dbs_account: process.env.DBS_ACCOUNT,
    infuraId: process.env.PUBLIC_INFURA_PROJECT_ID,
    walletConnectProjectId: process.env.PUBLIC_WALLETCONNECT_PROJECT_ID,
};