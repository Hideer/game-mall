const getters = {
  // 管理端系统
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  language: state => state.app.language,

  // 管理端-用户
  adminToken: state => state.userAdmin.adminToken,
  adminName: state => state.userAdmin.adminName,

  // 客户端-用户
  clientToken: state => state.userClient.clientToken,
  clientName: state => state.userClient.clientName
};

export default getters;

