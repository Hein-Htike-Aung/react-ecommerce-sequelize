import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { ThemeContext } from "../../../context/themeContext";
import { MaterialUISwitch } from "../../form/MaterialUISwitch";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import "./navbar.scss";

const Navbar: React.FC<{
  drawerWidth: number;
  handleDrawerToggle: () => void;
}> = ({ drawerWidth, handleDrawerToggle }) => {
  const { currentUser } = useContext(AuthContext);
  const { toggleTheme, themeMode } = useContext(ThemeContext);

  const changeTheme = (e: any) => {
    toggleTheme();
  };

  return (
    <div className="navbar">
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
        className="appbar"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <div className="navbarMenus">
            <div className="notification">
              <NotificationsNoneIcon />
              <span>3</span>
            </div>
            <FormControlLabel
            sx={{ marginRight: 0 }}
              control={
                <MaterialUISwitch
                  name="themeSwitch"
                  checked={!themeMode}
                  onClick={changeTheme}
                />
              }
              label=""
            />
            <img
              src={`https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=1200`}
              alt=""
              className="profilePic"
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
