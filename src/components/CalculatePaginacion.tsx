import { Pagination, Box } from '@mui/material';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function PaginationComponent({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
   
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null; 

    return (
        <Box sx={{ margin: '30px', display: 'flex', justifyContent: 'center' }}>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, value) => onPageChange(value)}
                color="primary"
            />
        </Box>
    );
}
