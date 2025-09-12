import React, { useState, useEffect } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';

declare const moment: any;

interface ConvertedTimes {
    unix: string;
    utc: string;
    local: string;
    relative: string;
}

export const TimestampConverter: React.FC = () => {
    const [input, setInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
    const [times, setTimes] = useState<ConvertedTimes | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const convertTime = () => {
            if (!input.trim()) {
                setTimes(null);
                setError('');
                return;
            }

            let m;
            // Check if it's a number (could be Unix timestamp in s or ms)
            if (/^\d+$/.test(input)) {
                const numInput = Number(input);
                // Heuristic: if it's a large number, it's likely ms, otherwise s.
                m = numInput > 1000000000000 ? moment(numInput) : moment.unix(numInput);
            } else {
                m = moment(input);
            }
            
            if (m.isValid()) {
                setTimes({
                    unix: m.unix().toString(),
                    utc: m.utc().format('YYYY-MM-DD HH:mm:ss Z'),
                    local: m.local().format('YYYY-MM-DD HH:mm:ss Z'),
                    relative: m.fromNow(),
                });
                setError('');
            } else {
                setTimes(null);
                setError('Invalid date or timestamp format.');
            }
        };
        convertTime();
    }, [input]);
    
    const OutputField = ({ label, value }: { label: string; value: string }) => (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <input
                type="text"
                value={value}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <CopyButton textToCopy={value} />
        </div>
    );

    return (
        <ToolContainer title="Timestamp Converter" description="Convert between Unix timestamps and human-readable dates.">
            <div className="space-y-6">
                <div>
                    <label htmlFor="timestamp-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input (Unix, ISO, etc.)</label>
                    <input
                        id="timestamp-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter timestamp or date..."
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                     <button onClick={() => setInput(Math.floor(Date.now() / 1000).toString())} className="mt-2 text-sm text-primary-600 hover:underline">Use current time</button>
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                {times && (
                    <div className="space-y-4">
                        <OutputField label="Unix Timestamp (seconds)" value={times.unix} />
                        <OutputField label="UTC" value={times.utc} />
                        <OutputField label="Your Local Time" value={times.local} />
                        <OutputField label="Relative Time" value={times.relative} />
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};