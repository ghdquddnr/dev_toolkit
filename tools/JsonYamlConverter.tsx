import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';

declare const jsyaml: any;

/**
 * Flattens a nested object into a single-level object with dot-separated keys.
 * Handles arrays by using bracket notation, e.g., 'parent.array[0]'.
 * @param obj The object to flatten.
 * @param path The current path prefix.
 * @returns A flattened object.
 */
const flattenObject = (obj: any, path: string = ''): Record<string, any> => {
  let result: Record<string, any> = {};

  if (typeof obj !== 'object' || obj === null) {
    if (path) result[path] = obj;
    return result;
  }

  for (const key of Object.keys(obj)) {
    const newPath = path ? (Array.isArray(obj) ? `${path}[${key}]` : `${path}.${key}`) : key;
    const value = obj[key];
    
    if (typeof value === 'object' && value !== null) {
      result = { ...result, ...flattenObject(value, newPath) };
    } else {
      result[newPath] = value;
    }
  }

  return result;
};

/**
 * Unflattens an object with dot/bracket-separated keys into a nested object.
 * @param data The flat object to unflatten.
 * @returns A nested object.
 */
const unflattenObject = (data: { [key: string]: string }): any => {
    const result = {};
    for (const path in data) {
        if (Object.prototype.hasOwnProperty.call(data, path)) {
            // Regex to split path into keys, handling both dot and bracket notations
            const keys = path.match(/([^[.\]]+)/g) || [];
            let current: any = result;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const isLast = i === keys.length - 1;

                if (isLast) {
                    current[key] = data[path];
                } else {
                    const nextKey = keys[i + 1];
                    const isNextNumeric = /^\d+$/.test(nextKey);
                    if (!current[key]) {
                        current[key] = isNextNumeric ? [] : {};
                    }
                    current = current[key];
                }
            }
        }
    }
    return result;
};


type ConversionMode = 'json-to-yaml' | 'yaml-to-json' | 'yaml-to-props' | 'props-to-yaml';

const modeInfo = {
    'json-to-yaml': { from: 'JSON', to: 'YAML' },
    'yaml-to-json': { from: 'YAML', to: 'JSON' },
    'yaml-to-props': { from: 'YAML', to: 'Properties' },
    'props-to-yaml': { from: 'Properties', to: 'YAML' },
};

export const JsonYamlConverter: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<ConversionMode>('json-to-yaml');
    const [error, setError] = useState('');

    const handleConvert = useCallback(() => {
        setError('');
        setOutput('');
        if (!input) return;

        try {
            switch (mode) {
                case 'json-to-yaml': {
                    const jsonObj = JSON.parse(input);
                    setOutput(jsyaml.dump(jsonObj));
                    break;
                }
                case 'yaml-to-json': {
                    const yamlObj = jsyaml.load(input);
                    setOutput(JSON.stringify(yamlObj, null, 2));
                    break;
                }
                case 'yaml-to-props': {
                    const yamlObj = jsyaml.load(input);
                    if (typeof yamlObj !== 'object' || yamlObj === null) {
                        throw new Error('Input is not a valid YAML object.');
                    }
                    const flattened = flattenObject(yamlObj);
                    const propsString = Object.keys(flattened)
                        .map(key => `${key}=${flattened[key]}`)
                        .join('\n');
                    setOutput(propsString);
                    break;
                }
                case 'props-to-yaml': {
                    const propsObj = input
                        .split('\n')
                        .filter(line => line.trim() !== '' && !line.trim().startsWith('#') && line.includes('='))
                        .reduce((acc: {[key: string]: string}, line) => {
                            const [key, ...valueParts] = line.split('=');
                            const value = valueParts.join('=');
                            acc[key.trim()] = value.trim();
                            return acc;
                        }, {});

                    const unflattened = unflattenObject(propsObj);
                    setOutput(jsyaml.dump(unflattened));
                    break;
                }
            }
        } catch (e: any) {
            setError(`Conversion failed: ${e.message}`);
        }
    }, [input, mode]);

    const { from, to } = modeInfo[mode];

    return (
        <ToolContainer title="JSON/YAML/Properties Converter" description="Convert data between JSON, YAML, and Java .properties formats.">
            <div className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                     <label htmlFor="conversion-mode" className="sr-only">Conversion Mode</label>
                     <select
                        id="conversion-mode"
                        value={mode}
                        onChange={(e) => setMode(e.target.value as ConversionMode)}
                        className="w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    >
                        <option value="json-to-yaml">JSON → YAML</option>
                        <option value="yaml-to-json">YAML → JSON</option>
                        <option value="yaml-to-props">YAML → Properties</option>
                        <option value="props-to-yaml">Properties → YAML</option>
                    </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <label htmlFor="converter-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Input ({from})
                        </label>
                        <textarea
                            id="converter-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Enter ${from} here...`}
                            className="w-full h-72 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600 font-mono"
                            spellCheck="false"
                        />
                    </div>
                     <div className="relative">
                        <label htmlFor="converter-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Output ({to})
                        </label>
                        <textarea
                            id="converter-output"
                            value={output}
                            readOnly
                            placeholder="Result will appear here..."
                            className="w-full h-72 p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600 font-mono"
                            spellCheck="false"
                        />
                        {output && <CopyButton textToCopy={output} />}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="flex items-center">
                     <button
                        onClick={handleConvert}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Convert
                    </button>
                </div>
            </div>
        </ToolContainer>
    );
};