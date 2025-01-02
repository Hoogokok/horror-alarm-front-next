export const ITEMS_PER_PAGE = 10;

export function calculateTotalPages(totalItems: number): number {
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
}

export function isLastPage(currentPage: number, totalItems: number): boolean {
    return currentPage >= calculateTotalPages(totalItems);
}

export function validatePageNumber(page: number, totalItems: number): number {
    const totalPages = calculateTotalPages(totalItems);
    if (page < 1) return 1;
    if (page > totalPages) return totalPages;
    return page;
} 