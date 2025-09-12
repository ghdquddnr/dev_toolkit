
import React from 'react';

interface ToolContainerProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export const ToolContainer: React.FC<ToolContainerProps> = ({ title, description, children }) => {
    return (
        <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
                </header>
                <main className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
