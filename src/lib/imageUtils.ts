// Image utility functions for the customization feature

/**
 * Validates if a file is an image
 */
export function isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
}

/**
 * Validates image file size (max 5MB)
 */
export function isValidImageSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}

/**
 * Converts a File to a base64 data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Validates an image file (type and size)
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!isValidImageFile(file)) {
        return {
            valid: false,
            error: 'Por favor, sube un archivo de imagen válido (JPG, PNG, GIF, WebP)',
        };
    }

    if (!isValidImageSize(file)) {
        return {
            valid: false,
            error: 'La imagen es demasiado grande. El tamaño máximo es 5MB',
        };
    }

    return { valid: true };
}
