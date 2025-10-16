import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import {
  ChevronDown,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
} from "lucide-react";

/**
 * Header Component - Phase 6.2
 *
 * Modern app header with logo, theme toggle, and profile dropdown menu.
 *
 * Features:
 * - StreamForge branding with icon
 * - Theme toggle button
 * - Profile dropdown (Settings, Help, Logout)
 * - Dark mode support
 * - Responsive design
 *
 * Usage:
 *   <Header />
 */
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".profile-dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Logo and branding */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          StreamForge AI
        </h1>
      </div>

      {/* Right side: Theme toggle + Profile dropdown */}
      <div className="flex items-center space-x-4 relative">
        <ThemeToggle />

        {/* Profile dropdown */}
        <div className="relative profile-dropdown">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              ON
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-2 text-sm z-50 animate-fadeIn">
              <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </button>
              <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                <HelpCircle className="w-4 h-4 mr-3" />
                Help
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors">
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
