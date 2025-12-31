import React, { useState } from 'react';

const DataTable = ({ title, columns, data, onSearch, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Search Logic
    const filteredData = data.filter(row =>
        Object.values(row).some(
            val => String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination Logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handleDownload = () => {
        // Simple CSV Export
        if (!data.length) return;
        const headers = columns.map(c => c.label).join(',');
        const rows = data.map(row => columns.map(c => row[c.key]).join(',')).join('\n');
        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${title.replace(' ', '_')}_data.csv`);
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <h5 className="mb-0 text-primary fw-bold">{title}</h5>
                <div className="d-flex gap-2">
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                            <i className="fas fa-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <button className="btn btn-outline-success" onClick={handleDownload} title="Export CSV">
                        <i className="fas fa-file-download"></i>
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">#</th>
                            {columns.map(col => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                            {onDelete && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.length > 0 ? (
                            currentRows.map((row, idx) => (
                                <tr key={idx}>
                                    <td className="ps-4 text-muted small">{indexOfFirstRow + idx + 1}</td>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.format ? col.format(row[col.key], row) : (row[col.key] || '-')}
                                        </td>
                                    ))}
                                    {onDelete && (
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this entry?')) {
                                                        onDelete(row.id || row._id);
                                                    }
                                                }}
                                                title="Delete Entry"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (onDelete ? 2 : 1)} className="text-center py-5 text-muted">
                                    <i className="fas fa-inbox fa-3x mb-3 opacity-25"></i>
                                    <p className="mb-0">No records found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="card-footer bg-white border-top-0 d-flex justify-content-end py-3">
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default DataTable;
