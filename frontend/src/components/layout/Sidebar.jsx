import { NavLink } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineArrowRightOnRectangle, HiOutlineXMark } from 'react-icons/hi2';
import useAuth from '../../hooks/useAuth';
import { getNavigationForRole } from '../../utils/navigation';
import { cn } from '../../utils/cn';

function NavItem({ item, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-brand-600 dark:text-brand-400' : '')} />
          <span className="truncate">{item.label}</span>
          {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { main, bottom } = getNavigationForRole(user?.role);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
              <HiOutlineShoppingBag className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold text-gray-900 dark:text-white">
              Cocomelon <span className="text-brand-600">WEB</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {main.map((item) => (
            <NavItem key={item.to} item={item} onNavigate={onClose} />
          ))}
        </nav>

        <div className="space-y-1 border-t border-gray-100 dark:border-gray-800 px-3 py-3">
          {bottom.map((item) => (
            <NavItem key={item.to} item={item} onNavigate={onClose} />
          ))}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <HiOutlineArrowRightOnRectangle className="h-5 w-5 shrink-0" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
