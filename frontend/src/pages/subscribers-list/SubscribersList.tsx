import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination, TableContainer } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosInstance } from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { StyledTableCell } from "../../components/form/StyledTableCell";
import TableSkeleton from "../../components/form/TableSkeleton";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import useJWT from "../../hooks/useJWT";
import { Subscriber } from "../../models/subscriber.model";
import { paginateRecords, paginationCount } from "../../utils/pagination";
import "./subscribers-list.scss";

const SubscribersList = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const axiosJwt = useJWT();
  const jwtReq = useRef<AxiosInstance>(axiosJwt);

  useEffect(() => {
    fetchAllSubscribers(currentPage);
  }, [currentPage]);

  const fetchAllSubscribers = async (currentPage: number) => {
    setFetching(true);

    const res = await jwtReq.current.get("/subscribers/list");

    if (res.data.data) {
      setSubscribers(paginateRecords(currentPage, res.data.data));
      setSubscribersCount(paginationCount(res.data.data));
    }

    setFetching(false);
  };

  const searchSubscribers = async (searchValue: string) => {
    if (searchValue) {
      searchValue = searchValue.toLowerCase();

      const filteredSubscribers = subscribers.filter(
        (s) => s.email.toLowerCase().indexOf(searchValue) >= 0
      );

      setSubscribers(() => paginateRecords(currentPage, filteredSubscribers));
      setSubscribersCount(paginationCount(filteredSubscribers));
    } else fetchAllSubscribers(1);
  };

  const onCopy = (data: Subscriber) => {
    navigator.clipboard.writeText(data.email);
    toast.success("Email Copied");
  };

  return (
    <div className="subscriberList">
      <ContentTitle title="Subscribers" />

      <div className="subscriberListWrapper">
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            onChange={(e) => searchSubscribers(e.target.value)}
            placeholder="Search"
            className="searchInput"
          />
        </div>

        {fetching ? (
          <TableSkeleton />
        ) : (
          <TableContainer component={Paper} className="subscriberTable">
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Joined at</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscribers?.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      {new Date(row.created_at).toDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <div className="tableIconsWrapper">
                        <div className="tableIcon">
                          <ContentCopyIcon onClick={() => onCopy(row)} />
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
            count={subscribersCount}
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

export default SubscribersList;
