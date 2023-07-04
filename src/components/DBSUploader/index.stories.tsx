import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import DBSUploader from "./index";

export default {
  title: "DBS UI Library/DBSUploader",
  component: DBSUploader,
} as Meta<typeof DBSUploader>;

const Template: StoryFn<typeof DBSUploader> = (args) => <DBSUploader {...args} />;

export const dbsuploader = Template.bind({});
dbsuploader.args = {
  dbs_settings: [
    {
      title: 'Filecoin',
      content: 'A microservice for uploading files to Lighthouse',
      payment: {
        chainId: 1,
        tokenAddress: "0xWETH_on_ETHERUEM"
      },
      field: {
        name: "filecoin",
        className: "inputFilecoin"
      }
    },
    {
      title: 'Arware',
      content: 'this is the content for the Arwave tab',
      payment: {
        chainId: 1,
        tokenAddress: "0xUSDT_on_ETHERUEM"
      },
      field: {
        name: "arweave",
        className: "inputArweave"
      }
    }
  ],
};