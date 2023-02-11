const paginateRecords = (currentPage: number, data: any) => {
  const start = (currentPage - 1) * 10;
  const end = currentPage * 10;
  return data.slice(start, end);
};

const paginationCount = (data: any) => Math.ceil(data.length / 10) || 1;

export { paginateRecords, paginationCount };
