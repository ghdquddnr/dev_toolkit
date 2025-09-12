import React, { useState } from 'react';
import { Tool, ToolDefinition } from '../types';
import { TOOLS } from '../constants';

interface SidebarProps {
    activeTool: Tool;
    onToolSelect: (tool: Tool) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, onToolSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTools = TOOLS.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const NavItem = ({ tool }: { tool: ToolDefinition }) => {
        const isActive = activeTool === tool.id;
        return (
            <li>
                <button
                    onClick={() => onToolSelect(tool.id)}
                    className={`flex items-center w-full p-2 rounded-lg text-left transition-colors duration-200 ${
                        isActive
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                    <span className={isActive ? 'text-white' : 'text-primary-500 dark:text-primary-400'}>
                        {tool.icon}
                    </span>
                    <span className="ml-3 font-medium">{tool.name}</span>
                </button>
            </li>
        );
    };

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col h-full border-r border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Dev Toolkit</h2>
            </div>
            <div className="p-4">
                 <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                />
            </div>
            <nav className="flex-1 px-4 pb-4 overflow-y-auto">
                <ul className="space-y-2">
                   {filteredTools.map(tool => (
                       <NavItem key={tool.id} tool={tool} />
                   ))}
                </ul>
            </nav>
        </aside>
    );
};