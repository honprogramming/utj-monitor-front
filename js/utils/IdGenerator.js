define(
    function() {
        var idGenerator = {
            getNewIntegerId: function(idsArray, scale) {
                let newId;
                let scaleFactor = scale || idsArray.length * 2;
                
                console.debug("ids: %o", idsArray);
                
                do {
                    newId = Math.floor(Math.random() * scaleFactor + 1);
                    console.debug("newId: %d", newId);
                } while (idsArray.includes(newId.toString()));
                
                return newId;
            }
        };
        
        return idGenerator;
    }
);