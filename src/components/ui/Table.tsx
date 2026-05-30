import React from 'react';

interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  onRowClick?: (row: any) => void;
  className?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  onRowClick,
  className = '',
  isLoading = false,
  emptyMessage = 'No data available',
}) => {
  const alignClass = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-card border border-gray-100 overflow-hidden ${className}`}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 font-semibold text-sm text-text-secondary ${alignClass(column.align)} ${
                    column.width ? `w-${column.width}` : ''
                  }`}
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-text-secondary">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-gray-200 transition-colors duration-200 ${
                    onRowClick ? 'hover:bg-primary-50 cursor-pointer' : 'hover:bg-gray-50'
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className={`px-6 py-4 text-sm text-text-primary ${alignClass(column.align)}`}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">{emptyMessage}</div>
        ) : (
          data.map((row, rowIndex) => (
            <div
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 ${
                onRowClick ? 'cursor-pointer active:scale-95 transition-transform' : ''
              }`}
            >
              {columns.map((column) => (
                <div key={`${rowIndex}-${column.key}`} className="flex justify-between items-start gap-2">
                  <span className="text-xs font-semibold text-text-secondary">{column.label}</span>
                  <span className="text-sm font-medium text-text-primary text-right">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Table;
