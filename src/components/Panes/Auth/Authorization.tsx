import { useState } from 'react';

interface AuthPanelProps {
  bearer: string;
}

/**
 *  AuthPanel Component
 */
const AuthPanel = ({ bearer }: AuthPanelProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('No Auth');

  /**
   *  Change Handler For Select
   */
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedOption(event.target.value);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p>Type</p>
        <select
          className="px-2 py-1.5 w-[200px] border border-gray-300 rounded-md hover:border-blue-500"
          onChange={handleOptionChange}
          value={selectedOption}
        >
          <option value="No Auth">No Auth</option>
          <option value="Bearer Token">Bearer Token</option>
        </select>
      </div>
      {selectedOption === 'No Auth' && (
        <div className="no-auth">
          <p>
            This request does not use any authorization. Learn more about
            authorization
          </p>
        </div>
      )}
      {selectedOption === 'Bearer Token' && (
        <div className="bearer">
          <p>Token</p>
          <input
            placeholder="Token"
            className="px-2 py-1.5 w-[200px] border border-gray-300 rounded-md outline-none border-one"
          />
        </div>
      )}
    </div>
  );
};

export default AuthPanel;
