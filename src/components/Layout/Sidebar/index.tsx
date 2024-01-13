import React, { useContext } from 'react';
import MenuHeader from './MenuHeader';
import MenuItem from './MenuItem';
import './Sidebar.css'; // Import your CSS file
import SidebarHeader from './SidebarHeader';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRequest } from '../../../slices/selectedRequestSlice';
import { ApiFlowRequest, Pair } from '../../../models';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../../store';
import { LogoutIcon } from '../../../fa-icons';
import AuthContext from '../../../context/AuthContext';

type LeftPaneProps = {
  activeItem: string;
  /**
   *  Navigation Sidebar Items ClickHandler Function Type
   */
  handleItemClick: (item: string) => void;
  menuItems: {
    key: string;
    icon: string;
    label: string;
  }[]; // Prop for menu items
};

const menuItems = [
  { key: 'collections', icon: 'fa-archive', label: 'Collections' },
  { key: 'apis', icon: 'fa-bolt', label: 'APIs' },
  { key: 'reports', icon: 'fa-th', label: 'Reports' },
  { key: 'saved-flows', icon: 'fa-server', label: 'Saved Flows' },
  { key: 'flows', icon: 'fa-television', label: 'Flows' },
  { key: 'history', icon: 'fa-history', label: 'History' },
];

/**
 *  Sidebar Component
 */
function Sidebar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const menuData = useSelector((state: RootState) => state.collections);
  const isSavedFlows = pathname.includes('saved-flows');
  const dispatch = useDispatch();
  const flows = useSelector((state: RootState) => state.flow.flows);
  /**
   *  Navigation Sidebar Items ClickHandler
   */
  const handleItemClick = (navKey: string) => nav(navKey);

  /**
   *  Update Selected Request State
   */
  const handleRequestStateChange = (request: Partial<ApiFlowRequest>) => {
    dispatch(setSelectedRequest(request));
  };

  /**
   *  Check If Navigation Sidebar Item Is Active
   */
  const isItemActive = (path: string, possiblePaths: string[]) =>
    possiblePaths.find((p) => path.includes(p));

  return (
    <div className="layout has-sidebar fixed-sidebar fixed-header resize-x">
      <LeftPane
        activeItem={
          isItemActive(
            pathname,
            menuItems.map((el) => el.key.toLowerCase())
          ) || menuItems[0].key
        }
        menuItems={menuItems}
        handleItemClick={handleItemClick}
      />
      <aside id="sidebar" className="sidebar break-point-sm has-bg-image">
        <div className="sidebar-layout resize-x">
          <SidebarHeader />
          <div className="sidebar-content">
            <nav className="menu open-current-submenu">
              <ul>
                <MenuHeader isSavedFlows={isSavedFlows} />
                {isSavedFlows && flows?.length
                  ? flows.map((menuItem, index) => {
                      return (
                        <MenuItem
                          key={index}
                          team=""
                          env={[]}
                          setUrl={(url: string) =>
                            handleRequestStateChange({ url })
                          }
                          setReqMethod={(method: any) =>
                            handleRequestStateChange({ method })
                          }
                          setHeaders={(headers: Pair) =>
                            handleRequestStateChange({ headers })
                          }
                          setQueryParams={(queryParams: Pair<string[]>) =>
                            handleRequestStateChange({ queryParams })
                          }
                          setDoc={(doc: string) =>
                            handleRequestStateChange({ doc })
                          }
                          setApiCompositeKey={(apiCompositeKeyId: string) =>
                            handleRequestStateChange({ apiCompositeKeyId })
                          }
                          mock={isSavedFlows}
                          flowName={menuItem.flowName}
                          flows={flows}
                        />
                      );
                    })
                  : menuData.map((menuItem, index) => (
                      <MenuItem
                        key={index}
                        team={menuItem.team}
                        env={menuItem.env}
                        setUrl={(url: string) =>
                          handleRequestStateChange({ url })
                        }
                        setReqMethod={(method: any) =>
                          handleRequestStateChange({ method })
                        }
                        setHeaders={(headers: Pair) =>
                          handleRequestStateChange({ headers })
                        }
                        setQueryParams={(queryParams: Pair<string[]>) =>
                          handleRequestStateChange({ queryParams })
                        }
                        setDoc={(doc: string) =>
                          handleRequestStateChange({ doc })
                        }
                        setApiCompositeKey={(apiCompositeKeyId: string) =>
                          handleRequestStateChange({ apiCompositeKeyId })
                        }
                        mock={isSavedFlows}
                        flowName=""
                        flows={flows}
                      />
                    ))}
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;

/**
 *  LeftPane Component
 */
const LeftPane: React.FC<LeftPaneProps> = ({
  activeItem,
  handleItemClick,
  menuItems,
}) => {
  const { resetAuthenticity } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Logout Handler
   */
  const logout = async () => {
    resetAuthenticity();
    navigate('/login');
  };

  return (
    <ul className="left-panel">
      {menuItems.map((menuItem) => (
        <li
          key={menuItem.key}
          className={activeItem === menuItem.key ? 'active' : ''}
          onClick={() => handleItemClick(menuItem.key)}
        >
          <i className={`fa ${menuItem.icon}`}></i>
          <span>{menuItem.label}</span>
        </li>
      ))}
      <li onClick={logout}>
        <LogoutIcon />
        <span>Logout</span>
      </li>
    </ul>
  );
};
