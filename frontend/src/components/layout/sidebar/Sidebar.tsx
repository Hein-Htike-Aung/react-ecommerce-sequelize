import TimelapseOutlinedIcon from "@mui/icons-material/TimelapseOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import StoreMallDirectoryOutlinedIcon from "@mui/icons-material/StoreMallDirectoryOutlined";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import "./sidebar.scss";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const sideBarMenus = [
    { name: "Dashboard", icons: <TimelapseOutlinedIcon />, route: "/" },
    { name: "Categories", icons: <WidgetsOutlinedIcon />, route: "/incomes" },
    {
      name: "Products",
      icons: <StoreMallDirectoryOutlinedIcon />,
      route: "/expenses",
    },
    {
      name: "Orders",
      icons: <ShoppingCartCheckoutOutlinedIcon />,
      route: "/categories",
    },
    { name: "Users", icons: <GroupOutlinedIcon />, route: "/categories" },
    { name: "NewLetters", icons: <EmailOutlinedIcon />, route: "/categories" },
    { name: "Settings", icons: <SettingsOutlinedIcon />, route: "/categories" },
  ];

  return (
    <div className="sidebar">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          <div className="logo"></div>
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {sideBarMenus.map((menu, idx) => (
          <Link className="link" to={menu.route} key={idx}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>{menu.icons}</ListItemIcon>
                <ListItemText primary={menu.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
