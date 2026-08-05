const Pagination = ({ page, pages, onPageChange }) => {
  if (!pages || pages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-3 pt-4">
      <button className="btn-secondary disabled:opacity-50" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span className="text-sm text-slate-500">Page {page} of {pages}</span>
      <button className="btn-secondary disabled:opacity-50" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
