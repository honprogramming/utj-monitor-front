define(
  [
    'data/AjaxUtils',
    'data/RESTConfig'
  ],
  function(AjaxUtils, RestConfig) {
    class Backups {
      
      static createBackup(name) {
        return AjaxUtils.ajax(RestConfig.admin.data.backups.path, 'POST', {name});
      }
      
      static deleteBackup(id) {
        return AjaxUtils.ajax(`${RestConfig.admin.data.backups.path}/${id}`, 'DELETE');
      }
      
      static getBackups() {
        return AjaxUtils.ajax(RestConfig.admin.data.backups.path, 'GET');
      }
    }
    
    return Backups;
  }
);