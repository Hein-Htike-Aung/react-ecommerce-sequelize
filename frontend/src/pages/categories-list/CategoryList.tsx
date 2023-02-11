import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OutlinedButton from "../../components/form/outlined-button/OutlinedButton";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import { Category } from "../../models/category.model";
import { axiosInstance } from "../../utils/axiosInstance";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./category-list.scss";
import { Pagination } from "@mui/material";
import ConfirmDialog from "../../components/widgets/confirm-dialog/ConfirmDialog";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import TableSkeleton from "../../components/form/TableSkeleton";
import { StyledTableCell } from "../../components/form/StyledTableCell";
import { paginateRecords, paginationCount } from "../../utils/pagination";

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [targetCategory, setTargetCategory] = useState<Category>();

  // useEffect
  useEffect(() => {
    fetchAllCategories(currentPage);
  }, [currentPage]);

  // axios functions
  const fetchAllCategories = async (currentPage: number) => {
    setFetching(true);
    const res = await axiosInstance.get(`/categories/list`);

    if (res.data.data) {
      setCategories(paginateRecords(currentPage, res.data.data));
      setCategoriesCount(paginationCount(res.data.data));
    }
    setFetching(false);
  };

  const searchCategory = async (searchValue: string) => {
    if (searchValue) {
      const res = await axiosInstance.get(
        `/categories/by_categoryName?categoryName=${searchValue}&page=${
          currentPage - 1
        }&pageSize=10`
      );

      setCategories(res.data.data.result);
      setCategoriesCount(Math.round(res.data.data.count / 10));
    } else fetchAllCategories(1);
  };

  // handle change
  const openConfirmDialog = (item: Category) => {
    setOpen(true);
    setTargetCategory(item);
  };

  const confirmDelete = async () => {
    if (targetCategory) {
      const res = await axiosInstance.delete(
        `/categories/delete/${targetCategory.id}`
      );

      if (res.status === 202) {
        toast.success("Category deleted");
        fetchAllCategories(1);
        setCurrentPage(1);
      }
    }
  };

  return (
    <div className="categoryList">
      <ContentTitle title="Categories">
        <OutlinedButton btnClick={() => navigate("/categories/edit/0")}>
          <AddIcon /> Add Category
        </OutlinedButton>
      </ContentTitle>
      <div className="categoryListWrapper">
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            onChange={(e) => searchCategory(e.target.value)}
            placeholder="Search"
            className="searchInput"
          />
        </div>

        {fetching ? (
          <TableSkeleton />
        ) : (
          <TableContainer component={Paper} className="categoryTable">
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell>Parent Category</StyledTableCell>
                  <StyledTableCell>Total Items</StyledTableCell>
                  <StyledTableCell>Created at</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories?.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <div className="categoryNameRow">
                        <img className="categoryImg" src={row.img} alt="" />{" "}
                        {row.categoryName}
                      </div>
                    </TableCell>
                    <TableCell>{row.parentCategoryName}</TableCell>
                    <TableCell>{0}</TableCell>
                    <TableCell>
                      {new Date(row.created_at).toDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <div className="tableIconsWrapper">
                        <div
                          className="tableIcon"
                          onClick={() => navigate(`/categories/edit/${row.id}`)}
                        >
                          <CreateIcon />
                        </div>
                        <div
                          className="tableIcon"
                          onClick={() => openConfirmDialog(row)}
                        >
                          <DeleteOutlineIcon />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <div className="paginationWrapper">
          <Pagination
            count={categoriesCount}
            onChange={(_: any, page: number) => setCurrentPage(page)}
            page={currentPage}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </div>
      </div>
      {/* Dialog */}
      <ConfirmDialog
        content="Are you sure you want to delete this Category?"
        open={open}
        setOpen={setOpen}
        agree={confirmDelete}
      />
    </div>
  );
};

export default CategoryList;
