import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Ticket, Upload, ChevronDown, List, Plus } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
}

interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  children?: {
    name: string;
    path: string;
    icon: React.ReactNode;
  }[];
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Vouchers']);

  const menuItems: MenuItem[] = [
    {
      name: 'Vouchers',
      icon: <Ticket className="w-5 h-5" />,
      children: [
        {
          name: 'List',
          path: '/vouchers',
          icon: <List className="w-4 h-4" />,
        },
        {
          name: 'Upload',
          path: '/vouchers/upload',
          icon: <Upload className="w-4 h-4" />,
        },
        {
          name: 'Add',
          path: '/vouchers/new',
          icon: <Plus className="w-4 h-4" />,
        },
      ],
    },
    // {
    //   name: 'Components',
    //   path: '/components',
    //   icon: <Palette className="w-5 h-5" />,
    // },
  ];

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen overflow-y-auto z-20',
        'bg-surface border-r border-border transition-all duration-300',
        isOpen ? 'w-60' : 'w-0',
        'hidden lg:block'
      )}
    >
      {/* Logo and Title */}
      <div className="h-16 flex items-center space-x-3 px-6 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 bg-primary-soft rounded-lg">
          <Ticket className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xs font-semibold text-text-primary">
          Voucher Management System
        </h1>
      </div>

      <nav className="pt-8 px-6 pb-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.name}>
            {/* Parent Menu */}
            {item.children ? (
              <button
                onClick={() => toggleMenu(item.name)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors text-text-secondary hover:bg-muted hover:text-text-primary"
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <ChevronDown
                  className={clsx(
                    'w-4 h-4 transition-transform',
                    expandedMenus.includes(item.name) && 'rotate-180'
                  )}
                />
              </button>
            ) : (
              <NavLink
                to={item.path!}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-soft text-primary border-l-3 border-primary'
                      : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                  )
                }
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            )}

            {/* Children Menu */}
            {item.children && expandedMenus.includes(item.name) && (
              <div className="mt-1 ml-4 space-y-1">
                {item.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    end
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary-soft text-primary border-l-3 border-primary'
                          : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                      )
                    }
                  >
                    {child.icon}
                    <span className="text-sm font-medium">{child.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
