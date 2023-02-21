import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
import { toast } from "react-toastify";
import LockIcon from "@mui/icons-material/Lock";
import { User } from "../../../models/user.model";
import { axiosInstance } from "../../../utils/axiosInstance";
import TableSkeleton from "../../form/TableSkeleton";
import { StyledTableCell } from "../../form/StyledTableCell";
import ConfirmDialog from "../confirm-dialog/ConfirmDialog";
import "./user_list.scss";

const UserList = () => {
  const [userCount, setUsersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = React.useState(false);
  const [targetUser, setTargetUser] = useState<User>();

  useEffect(() => {
    fetchAllUsers(currentPage);
  }, [currentPage]);

  // functions
  const fetchAllUsers = async (currentPage: number) => {
    setFetching(true);

    const res = await axiosInstance.get(
      `/users/list?page=${currentPage - 1}&pageSize=10`
    );

    let users = res.data.data;

    if (users.length) {
      users = users.filter((u: User) => u.role !== "Customer");

      setUsers(users.reverse());
      setUsersCount(Math.ceil(users.count / 10) || 1);
    }

    setFetching(false);
  };

  // handle Change

  const openConfirmDialog = (item: User) => {
    setOpen(true);
    setTargetUser(item);
  };

  const confirmDelete = async () => {
    if (targetUser) {
      const res = await axiosInstance.delete(`/users/delete/${targetUser.id}`);

      if (res.status === 202) {
        toast.success("User deleted");
        fetchAllUsers(1);
        setCurrentPage(1);
      }
    }
  };

  return (
    <div className="user_list">
      {fetching ? (
        <TableSkeleton />
      ) : (
        <TableContainer component={Paper} className="userTable">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
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
                    <div className="userRow">
                      <img
                        className="userImg"
                        src={row.img || "./user-profile.png"}
                        alt=""
                      />{" "}
                      {row.fullName}
                    </div>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    {new Date(row.created_at).toDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <div className="tableIconsWrapper">
                      {row.role !== "Admin" ? (
                        <div
                          className="tableIcon"
                          onClick={() => openConfirmDialog(row)}
                        >
                          <DeleteOutlineIcon />
                        </div>
                      ) : (
                        <>
                          <div className="tableIcon">
                            <LockIcon />
                          </div>
                        </>
                      )}
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
          count={userCount}
          onChange={(_: any, page: number) => setCurrentPage(page)}
          page={currentPage}
          color="primary"
          variant="outlined"
          shape="rounded"
        />
      </div>
      {/* Dialog */}
      <ConfirmDialog
        content="Are you sure you want to delete this User?"
        open={open}
        setOpen={setOpen}
        agree={confirmDelete}
      />
    </div>
  );
};

export default UserList;
