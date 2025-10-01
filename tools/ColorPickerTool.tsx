import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';
import { useTranslation } from '../i18n';

const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const defaultColor = '#3B82F6';

export const ColorPickerTool: React.FC = () => {
    const { t } = useTranslation();
    const [color, setColor] = useState(defaultColor);
    
    const rgb = hexToRgb(color);
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newHex = e.target.value;
        if (!newHex.startsWith('#')) {
            newHex = '#' + newHex;
        }
        if (/^#[0-9A-F]{6}$/i.test(newHex)) {
            setColor(newHex.toUpperCase());
        }
    };

    const handleReset = useCallback(() => {
        setColor(defaultColor);
    }, []);

    const ColorValueDisplay = ({ label, value }: { label: string; value: string }) => (
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
        <ToolContainer title={t('tool.color.name')} description={t('tool.color.longDescription')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center items-center">
                    <div
                        className="w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg border-4 border-white dark:border-gray-700"
                        style={{ backgroundColor: color }}
                    ></div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="color-picker-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.color.colorPicker')}</label>
                        <input
                            id="color-picker-input"
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value.toUpperCase())}
                            className="w-full h-12 p-1 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                        />
                    </div>
                     <div>
                        <label htmlFor="hex-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HEX</label>
                        <input
                            id="hex-input"
                            type="text"
                            value={color}
                            onChange={handleHexChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 font-mono text-gray-900 dark:text-white"
                        />
                    </div>
                    {rgb && <ColorValueDisplay label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />}
                    {hsl && <ColorValueDisplay label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />}
                    <div className="pt-2">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            {t('common.reset')}
                        </button>
                    </div>
                </div>
            </div>
        </ToolContainer>
    );
};
