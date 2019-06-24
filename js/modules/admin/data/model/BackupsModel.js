define(
  [],
  function() {
    class BackupsModel {
      
      constructor(backups) {
        this.setData(backups);
        this.backupsMap = this.getData()
            .reduce(
              (map, backup) => {
                map[backup["id"]] = backup;
                return map;
              },
              {}
            );
      }
      
      setData(backups) {
        if (backups && Array.isArray(backups)) {
          this.backups = backups;
        } else {
          this.backups = [];
        }
      }
      
      getData() {
        return this.backups;
      }
      
      getItems() {
        return this.backupsMap;
      }
    }
    
    return BackupsModel;
  }
);