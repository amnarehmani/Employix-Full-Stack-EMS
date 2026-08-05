export const getPagination = (query) => {
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '8', 10), 1), 50);
  return { page, limit, skip: (page - 1) * limit };
};

export const paged = (items, total, page, limit) => ({
  items,
  page,
  pages: Math.max(Math.ceil(total / limit), 1),
  total,
});
