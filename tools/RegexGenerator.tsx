import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';
import { useTranslation } from '../i18n';

export const RegexGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [regex, setRegex] = useState('');
    const [testString, setTestString] = useState('');
    const [testResults, setTestResults] = useState<React.ReactElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = useCallback(async () => {
        if (!prompt) return;

        setIsLoading(true);
        setError('');
        setRegex('');
        setTestResults(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const modelPrompt = `You are an expert regex generator. Based on the following description, provide ONLY the regular expression pattern. Do not include any explanation, code fences, or any character outside of the pattern itself.\n\nDescription: "${prompt}"`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: modelPrompt,
            });
            
            const generatedText = response.text.trim();
            const cleanedRegex = generatedText.replace(/^`{3}regex\n|`{3}$/g, '').replace(/^`|`$/g, '').trim();

            setRegex(cleanedRegex);
            
        } catch (e) {
            console.error(e);
            setError(t('tool.regex.errorAPI'));
        } finally {
            setIsLoading(false);
        }
    }, [prompt, t]);
    
    const handleTest = useCallback(() => {
        setError('');
        if (!regex) {
            if (testString) setError(t('tool.regex.errorNoRegex'));
            setTestResults(null);
            return;
        }
         if (!testString) {
            setTestResults(null);
            return;
        }

        try {
            const regexPattern = new RegExp(regex, 'g');
            const lines = testString.split('\n');
            const results = lines.map((line, index) => {
                if (line.trim() === '') return <div key={index}>&nbsp;</div>;
                
                const matches = [...line.matchAll(regexPattern)];
                
                if (matches.length > 0) {
                    let lastIndex = 0;
                    const parts: (string | React.ReactElement)[] = [];
                    matches.forEach((match, matchIndex) => {
                        if (match.index > lastIndex) {
                            parts.push(line.substring(lastIndex, match.index));
                        }
                        parts.push(<mark key={`match-${matchIndex}`} className="bg-yellow-300 dark:bg-yellow-600 rounded px-1">{match[0]}</mark>);
                        lastIndex = match.index + match[0].length;
                    });
                    if (lastIndex < line.length) {
                        parts.push(line.substring(lastIndex));
                    }
                    return (
                        <div key={index} className="flex items-start gap-2">
                            <span className="text-green-500 font-bold text-sm select-none w-20 text-right">{t('tool.regex.match')}</span>
                            <pre className="flex-1 whitespace-pre-wrap break-all">{parts}</pre>
                        </div>
                    );
                } else {
                     return (
                        <div key={index} className="flex items-start gap-2">
                             <span className="text-red-500 font-bold text-sm select-none w-20 text-right">{t('tool.regex.noMatch')}</span>
                             <pre className="flex-1 whitespace-pre-wrap break-all text-gray-500">{line}</pre>
                        </div>
                    );
                }
            });

            setTestResults(<div className="space-y-1 font-mono text-sm">{results}</div>);

        } catch (e) {
            setError(t('tool.regex.errorInvalidRegex'));
            setTestResults(null);
        }
    }, [regex, testString, t]);

    const handleReset = useCallback(() => {
        setPrompt('');
        setRegex('');
        setTestString('');
        setTestResults(null);
        setError('');
        setIsLoading(false);
    }, []);

    return (
        <ToolContainer title={t('tool.regex.name')} description={t('tool.regex.longDescription')}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="regex-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.regex.promptLabel')}</label>
                    <textarea
                        id="regex-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('tool.regex.promptPlaceholder')}
                        className="w-full h-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? t('tool.regex.generating') : t('common.generate')}
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        {t('common.reset')}
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="relative">
                    <label htmlFor="regex-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.regex.generatedRegex')}</label>
                    <input
                        id="regex-output"
                        type="text"
                        value={regex}
                        onChange={(e) => setRegex(e.target.value)}
                        placeholder={t('tool.regex.outputPlaceholder')}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-white text-gray-900 dark:border-gray-600 font-mono"
                    />
                    {regex && <CopyButton textToCopy={regex} />}
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="space-y-4">
                    <div>
                        <label htmlFor="regex-test" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.regex.testStringLabel')}</label>
                        <textarea
                            id="regex-test"
                            value={testString}
                            onChange={(e) => setTestString(e.target.value)}
                            placeholder={t('tool.regex.testStringPlaceholder')}
                            className="w-full h-32 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600 font-mono"
                            spellCheck="false"
                        />
                    </div>
                    <button
                        onClick={handleTest}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {t('tool.regex.testButton')}
                    </button>
                     {testResults && (
                        <div>
                             <h3 className="text-lg font-medium mb-2">{t('tool.regex.testResults')}</h3>
                             <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
                                {testResults}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </ToolContainer>
    );
};
