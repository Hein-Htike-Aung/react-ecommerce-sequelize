import React, { useEffect, useRef, useState } from "react";
import {
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useJWT from "../../hooks/useJWT";
import { User } from "../../models/user.model";
import { useNavigate } from "react-router-dom";
import { AxiosInstance } from "axios";
import AddIcon from "@mui/icons-material/Add";
import TableSkeleton from "../../components/form/TableSkeleton";
import { StyledTableCell } from "../../components/form/StyledTableCell";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import OutlinedButton from "../../components/form/outlined-button/OutlinedButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./user-list.scss";

const UserLIst = () => {
  const navigate = useNavigate();
  const axiosJWT = useJWT();
  const jwtReq = useRef<AxiosInstance>(axiosJWT);
  const [users, setUsers] = useState<User[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchAllUsers(currentPage);
  }, [currentPage]);

  // functions
  const fetchAllUsers = async (currentPage: number) => {
    setFetching(true);

    const res = await jwtReq.current.get(
      `/users/list?page=${currentPage - 1}&pageSize=10`
    );

    let users = res.data.data;

    if (users.length) {
      users = users.filter((u: User) => u.role === "Customer");

      setUsers(users.reverse());
      setUsersCount(Math.ceil(users.count / 10) || 1);
    }

    setFetching(false);
  };

  const searchCustomer = async (searchValue: string) => {};

  return (
    <div className="customer_list">
      <ContentTitle title="Customers"></ContentTitle>

      <div className="customerListWrapper">
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            onChange={(e) => searchCustomer(e.target.value)}
            placeholder="Search"
            className="searchInput"
          />
        </div>

        {fetching ? (
          <TableSkeleton />
        ) : (
          <TableContainer component={Paper} className="customerTable">
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Phone</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Joined</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <div className="customerRow">
                        <img
                          className="customerImg"
                          src={row.img || "./user-profile.png"}
                          alt=""
                        />{" "}
                        {row.fullName}
                      </div>
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>
                      <div
                        className={`${
                          row.status ? "errorBudget" : "successBudget"
                        }`}
                      >
                        {row.status ? "Inactive" : "Active"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(row.created_at).toDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <div className="tableIconsWrapper">
                        <div
                          className="tableIcon"
                          onClick={() => navigate(`/user-list/${row.id}`)}
                        >
                          <VisibilityIcon />
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
            count={usersCount}
            onChange={(_: any, page: number) => setCurrentPage(page)}
            page={currentPage}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default UserLIst;
