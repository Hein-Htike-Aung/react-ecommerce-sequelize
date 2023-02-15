import React from "react";
import ContentTitle from "../../components/layout/content-title/ContentTitle";
import "./settings.scss";
import StyledTabs, {
  TabPanel,
} from "../../components/layout/styled_tabs/StyledTabs";
import UserList from "../../components/widgets/user_list/UserList";
import AddUser from "../../components/widgets/add_user/AddUser";
import ChangePassword from "../../components/widgets/change-password/ChangePassword";
import ProfileSetting from "../../components/widgets/profile-setting/ProfileSetting";

const Settings = () => {
  const [tabValue, setTabValue] = React.useState(0);

  // handle Change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="settings">
      <ContentTitle title="Settings" />

      <div className="settingsListWrapper">
        <StyledTabs
          value={tabValue}
          handleChange={handleTabChange}
          tabs={[
            "Profile Settings",
            "Roles",
            "Add Role",
            "Notifications",
            "Change Password",
          ]}
        >
          <TabPanel value={tabValue} index={0}>
            {/* Profile Settings */}
            <ProfileSetting />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {/* Roles */}
            <UserList />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {/* Add Role */}
            <AddUser />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            {/* Notifications */}
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            {/* Change Password */}
            <ChangePassword />
          </TabPanel>
        </StyledTabs>
      </div>
    </div>
  );
};

export default Settings;
