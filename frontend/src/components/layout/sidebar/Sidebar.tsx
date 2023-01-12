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
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import "./sidebar.scss";
import { useContext } from "react";
import { ThemeContext } from "../../../context/themeContext";

const Sidebar = () => {
  const { themeMode } = useContext(ThemeContext);

  const sideBarMenus = [
    { name: "Dashboard", icons: <TimelapseOutlinedIcon />, route: "/" },
    {
      name: "Categories",
      icons: <WidgetsOutlinedIcon />,
      route: "/categories",
    },
    {
      name: "Products",
      icons: <StoreMallDirectoryOutlinedIcon />,
      route: "/product-list",
    },
    {
      name: "Orders",
      icons: <ShoppingCartCheckoutOutlinedIcon />,
      route: "/orders-list",
    },
    { name: "Users", icons: <GroupOutlinedIcon />, route: "/user-list" },
    {
      name: "NewLetters",
      icons: <EmailOutlinedIcon />,
      route: "/newLetter-list",
    },
    { name: "Settings", icons: <SettingsOutlinedIcon />, route: "/settings" },
  ];

  return (
    <div className="sidebar">
      <Toolbar>
        <Typography variant="h6" component="div">
          <div className="logo"></div>
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {sideBarMenus.map((menu, idx) => (
          <NavLink
            to={menu.route}
            className={`link ${themeMode ? "menuLinkDark" : "menuLinkLight"}`}
            key={idx}
          >
            <ListItemButton>
              <ListItem disablePadding>
                <div className="menu">
                  <div className="menuIcon">{menu.icons}</div>
                  <div className="menuText">{menu.name}</div>
                </div>
              </ListItem>
            </ListItemButton>
          </NavLink>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
