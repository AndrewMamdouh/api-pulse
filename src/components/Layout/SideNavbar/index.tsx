import React, { FunctionComponent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlowIcon, RequestsIcon } from '../../../fa-icons';
interface SideNavBarProps {}

/**
 *  SideNavBar Component
 */
const SideNavBar: FunctionComponent<SideNavBarProps> = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const actions = [
    {
      title: 'Requests',
      icon: <RequestsIcon />,
      navKey: 'requests',
    },
    {
      title: 'Flows',
      icon: <FlowIcon />,
      navKey: 'flows',
    },
  ];

  /**
   *  To Add Active State To Current Navigation Item
   */
  const isInCurrentTab = (navKey: string) => pathname.includes(navKey);

  return (
    <div className="h-fill bg-slate-500 w-[60px] flex flex-col">
      {actions.map((action) => (
        <div
          onClick={() => nav(action.navKey)}
          className={`h-[60px] p-2 flex flex-col text-center align-middle justify-end  cursor-pointer hover:bg-slate-600 transition-colors ${
            isInCurrentTab(action.navKey) ? 'text-white bg-slate-800' : ''
          }`}
        >
          <div className="text-xl">{action.icon}</div>
          <div className="text-[10px] text-center">{action.title}</div>
        </div>
      ))}
    </div>
  );
};

export default SideNavBar;
