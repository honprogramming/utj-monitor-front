define(
    function() {
        var idGenerator = {
            getNewIntegerId: function(idsArray, scale) {
                var newId;
                console.debug("ids: %o", idsArray);
                
                do {
                    newId = Math.floor(Math.random() * scale);
                    console.debug("newId: %d", newId);
                } while (idsArray.includes(newId.toString()));
                
                return newId;
            }
        };
        
        return idGenerator;
    }
);