import { useCallback, useState } from 'react';
import { ReloadIcon } from '../../../fa-icons';
import { Button } from '../../UI';
import { getFlowData } from '../../../api/getServices';
import { updateAllFlows } from '../../../slices/flowSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

type MenuHeaderProps = {
  isSavedFlows?: boolean;
};
/**
 *  MenuHeader Component
 */
export default function MenuHeader({ isSavedFlows = false }: MenuHeaderProps) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  /**
   * Fetch Flows
   */
  const fetchFlows = useCallback(async () => {
    setLoading(true);
    const result = await getFlowData();
    if (result) {
      dispatch(updateAllFlows(result));
      toast.success('Flows updated successfully');
    } else {
      toast.error('Unexpected Error. Please, try again later');
    }
    setLoading(false);
  }, [dispatch]);

  return (
    <li className="menu-header">
      <span> SERVICES </span>
      <div className="flex items-center gap-2 mt-2">
        <div className="searchInputWrapper flex-grow mt-0">
          <i className="searchInputIcon fa fa-search"></i>
          <input className="searchInput" type="text" placeholder="Search" />
        </div>
        {isSavedFlows ? (
          <Button
            variant="secondary"
            size="sm"
            iconOnly={true}
            onClick={fetchFlows}
            className="px-2.5 py-2.5"
            disabled={loading}
          >
            <span
              className={`text-md flex justify-center items-center ${
                loading ? 'animate-spin' : ''
              }`}
            >
              <ReloadIcon />
            </span>
          </Button>
        ) : null}
      </div>
    </li>
  );
}
