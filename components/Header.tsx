import React from 'react';
import { ToolDefinition } from '../types';
import { SunIcon, MoonIcon } from './Icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '../i18n';

interface HeaderProps {
    activeTool: ToolDefinition;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTool, theme, toggleTheme }) => {
    const { t } = useTranslation();

    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{t(activeTool.name)}</h1>
            <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                    aria-label={t('header.toggleTheme')}
                >
                    {theme === 'light' ? (
                        <MoonIcon className="w-6 h-6 text-gray-700" />
                    ) : (
                        <SunIcon className="w-6 h-6 text-yellow-400" />
                    )}
                </button>
            </div>
        </header>
    );
};
