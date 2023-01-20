import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OutlinedButton from "../../components/form/outlined-button/OutlinedButton";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import "./product-list.scss";
import { Product } from "../../models/product.model";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import TableSkeleton from "../../components/form/TableSkeleton";
import {
  FormControlLabel,
  Pagination,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ConfirmDialog from "../../components/widgets/confirm-dialog/ConfirmDialog";
import { StyledTableCell } from "../../components/form/StyledTableCell";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import numberWithComma from "../../utils/numberWithComma";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [targetProduct, setTargetProduct] = useState<Product>();

  // useEffect
  useEffect(() => {
    fetchAllProducts(currentPage);
  }, [currentPage]);

  // axios functions
  const searchProduct = async (searchValue: string) => {
    if (searchValue) {
      const res = await axiosInstance.get(
        `products/by_productName?productName=${searchValue}&page=${
          currentPage - 1
        }&pageSize=10`
      );

      setProducts(res.data.data.result);
      setProductsCount(Math.round(res.data.data.count / 10));
    } else fetchAllProducts(1);
  };

  const fetchAllProducts = async (currentPage: number) => {
    setFetching(true);
    const res = await axiosInstance.get(
      `/products/list?page=${currentPage - 1}&pageSize=10`
    );

    setProducts(res.data.data.result);
    setProductsCount(Math.round(res.data.data.count / 10));
    setFetching(false);
  };

  // handle change
  const openConfirmDialog = (item: Product) => {
    setOpen(true);
    setTargetProduct(item);
  };

  const confirmDelete = async () => {
    if (targetProduct) {
      const res = await axiosInstance.delete(
        `/products/delete/${targetProduct.id}`
      );

      if (res.status === 202) {
        toast.success("Product deleted");
        fetchAllProducts(1);
        setCurrentPage(1);
      }
    }
  };

  console.log(products);

  return (
    <div className="productList">
      <ContentTitle title="Products">
        <OutlinedButton btnClick={() => navigate("/products/edit/0")}>
          <AddIcon /> Add Product
        </OutlinedButton>
      </ContentTitle>

      <div className="productListWrapper">
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            onChange={(e) => searchProduct(e.target.value)}
            placeholder="Search"
            className="searchInput"
          />
        </div>

        {fetching ? (
          <TableSkeleton />
        ) : (
          <TableContainer component={Paper} className="productTable">
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Product</StyledTableCell>
                  <StyledTableCell>Created at</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Rating</StyledTableCell>
                  <StyledTableCell>Price</StyledTableCell>
                  <StyledTableCell>Featured</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <div className="productNameRow">
                        <img
                          className="productImg"
                          src={row.productImages[0]}
                          alt=""
                        />{" "}
                        {row.productName}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(row.created_at).toDateString()}
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>rating</TableCell>
                    <TableCell>
                      ${numberWithComma(row.sale_price | 0)}
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e: any) => {}}
                            checked={row.isFeatured}
                          />
                        }
                        label=""
                      />
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
            count={productsCount}
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

export default ProductList;
