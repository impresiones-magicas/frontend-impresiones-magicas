export interface PrintArea {
    top: number;    // Percentage (0-100)
    left: number;   // Percentage (0-100)
    width: number;  // Percentage (0-100)
    height: number; // Percentage (0-100)
}

export const PRINT_AREAS: Record<string, PrintArea> = {
    'default': {
        top: 15,
        left: 20,
        width: 60,
        height: 65
    },
    // Camiseta Básica Blanca (o similares)
    'shirt': {
        top: 15,
        left: 25,
        width: 50,
        height: 60
    },
    // Hoodie / Sudadera
    'hoodie': {
        top: 20,
        left: 30,
        width: 40,
        height: 50
    },
    // Taza
    'mug': {
        top: 25,
        left: 35,
        width: 45,
        height: 50
    }
};

export const PRESET_POSITIONS = [
    { label: 'Centro', x: 34, y: 30 },
    { label: 'Pecho Izq.', x: 55, y: 20 },
    { label: 'Pecho Der.', x: 15, y: 20 },
    { label: 'Abajo Centro', x: 34, y: 60 }
];

/**
 * Gets the relative print area for a product based on its name or category.
 * Currently using simple string matching for names.
 */
export const getPrintArea = (productName: string): PrintArea => {
    const name = productName.toLowerCase();
    if (name.includes('camiseta')) return PRINT_AREAS['shirt'];
    if (name.includes('hoodie') || name.includes('sudadera')) return PRINT_AREAS['hoodie'];
    if (name.includes('taza')) return PRINT_AREAS['mug'];
    return PRINT_AREAS['default'];
};
