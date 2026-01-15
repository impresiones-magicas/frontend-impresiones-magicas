import { config } from './config';

export const getMediaUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // Remove /api if present in the base host
    const host = config.apiUrl.replace('/api', '');
    return `${host}${path}`;
};
