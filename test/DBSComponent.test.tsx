import React from 'react';
import { render, waitFor } from '@testing-library/react';
import DBSUploader from '../src/components/DBSUploader';

describe('DBSUploader', () => {
  it('renders DBSUploader component', async () => {
    const { getByText } = render(
      <DBSUploader
        infuraId="your-infura-id"
        walletConnectProjectId="your-walletconnect-project-id"
        dbs_url="your-dbs-url"
        dbs_account="your-dbs-account"
      />
    );

    await waitFor(() => {
      expect(getByText('DBSComponent Mock')).toBeInTheDocument();
    });
  });
});
