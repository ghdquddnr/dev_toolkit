
import React from 'react';

export enum Tool {
    BASE64 = 'Base64 Encoder/Decoder',
    JSON_YAML = 'JSON/YAML/Properties Converter',
    URL = 'URL Encoder/Decoder',
    HASH = 'Hash Generator',
    UUID = 'UUID/GUID Generator',
    DIFF = 'Text Diff Tool',
    MERGE = 'Merge Tool',
    CRON = 'Cron Expression Generator',
    TIMESTAMP = 'Timestamp Converter',
    COLOR_PICKER = 'Color Picker',
    LOREM_IPSUM = 'Lorem Ipsum Generator',
    REGEX = 'Regex Generator',
}

export interface ToolDefinition {
    id: Tool;
    name: string;
    description: string;
    // FIX: Replaced `JSX.Element` with `React.ReactElement` to resolve the "Cannot find namespace 'JSX'" error.
    icon: React.ReactElement;
    component: React.ComponentType;
}