import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Tool } from './types';
import { TOOLS, TOOLS_MAP } from './constants';
import { I18nProvider } from './i18n';

declare global {
    interface Window {
        jsdiffLoadedPromise?: Promise<boolean>;
    }
}

function AppContent() {
    const [activeToolId, setActiveToolId] = useState<Tool>(Tool.BASE64);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isJsdiffLoaded, setIsJsdiffLoaded] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);

        if (window.jsdiffLoadedPromise) {
            window.jsdiffLoadedPromise.then(() => {
                console.log('jsdiff library has successfully loaded.');
                setIsJsdiffLoaded(true);
            });
        } else {
            console.error('jsdiff loading promise not found. Check index.html setup.');
        }
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const activeTool = useMemo(() => {
        return TOOLS_MAP.get(activeToolId) ?? TOOLS[0];
    }, [activeToolId]);
    
    const renderActiveTool = () => {
        const ActiveToolComponent = activeTool.component;
        if (activeTool.id === Tool.DIFF || activeTool.id === Tool.MERGE) {
            const ToolWithProps = ActiveToolComponent as React.ComponentType<{ isLibLoaded: boolean }>;
            return <ToolWithProps isLibLoaded={isJsdiffLoaded} />;
        }
        return <ActiveToolComponent />;
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar activeTool={activeToolId} onToolSelect={setActiveToolId} />
            <div className="flex-1 flex flex-col">
                <Header activeTool={activeTool} theme={theme} toggleTheme={toggleTheme} />
                <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
                    {renderActiveTool()}
                </div>
            </div>
        </div>
    );
}


export default function App() {
    return (
        <I18nProvider>
            <AppContent />
        </I18nProvider>
    );
}
