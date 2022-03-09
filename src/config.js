const config = {
  database: {
    VooshDB:
      "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
    documentName: "operationsdb",
  },

  main_collections: {
    //   nvdpColleaction
    nvdp: "non_voosh_dashboard_products",
    // onboardProductsColleaction
    onboardProducts: "onboard_products",
    // onboardNotificationsCollection
    onboardNotifications: "Onboard_Notifications",
    // save all user numbers
    saveAllUsersNumber: "save_all_users_number",
    // flags_banners_products
    flagsBannersProducts: "flags_banners_products",
    // swiggyNvdpCollection
    swiggyNvdp: "swiggy_nvdp",
  },
  uat_collections: {
    //   nvdpColleaction
    nvdp: "non_voosh_dashboard_products_UAT",
    // onboardProductsColleaction
    onboardProducts: "Onboard_New_Users_UAT",
    // onboardNotificationsCollection
    onboardNotifications: "Onboard_Notifications_UAT",
    // save all user numbers
    saveAllUsersNumber: "save_all_users_number_UAT",
    // flags_banners_products
    flagsBannersProducts: "flags_banners_products_UAT",
    // swiggyNvdpCollection
    swiggyNvdp: "swiggy_nvdp_UAT",
  },
  secret: "secret",
};

module.exports = { config };
