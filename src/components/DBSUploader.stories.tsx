import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import DBSUploader from "./DBSUploader";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "ReactComponentLibrary/DBSUploader",
  component: DBSUploader,
} as Meta<typeof DBSUploader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof DBSUploader> = (args) => <DBSUploader {...args} />;

export const dbsuploader = Template.bind({});
dbsuploader.args = {
  children: "This is a test",
};