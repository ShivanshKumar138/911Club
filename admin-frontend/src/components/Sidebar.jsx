/*eslint-disable*/
import { Link } from 'react-router-dom';
import { Settings, Users, DollarSign, HelpCircle, Globe } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r">
      <ul className="space-y-2 font-medium">
        <li>
          <Link 
            to="/members"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
          >
            <Users className="h-4 w-4" />
            Members
          </Link>
        </li>
        <li>
          <Link 
            to="/salary"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
          >
            <DollarSign className="h-4 w-4" />
            Salary
          </Link>
        </li>
        <li>
          <Link 
            to="/activity-setting"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
          >
            <Settings className="h-4 w-4" />
            Activity Settings
          </Link>
        </li>
        {/* ... other menu items ... */}
      </ul>
    </div>
  );
};

export default Sidebar; 