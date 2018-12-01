define(
    function() {
        var idGenerator = {
            getNewIntegerId: function(idsArray, scale) {
                let newId;
                let scaleFactor = scale || idsArray.length * 2;
                
                do {
                    newId = Math.floor(Math.random() * scaleFactor + 1);
                } while (idsArray.includes(newId.toString()));
                
                return newId;
            }
        };
        
        return idGenerator;
    }
);