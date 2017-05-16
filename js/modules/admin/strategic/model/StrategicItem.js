define(
        function () {

            function StrategicItem(id, name, type) {
                this.id = id;
                this.name = name;
                this.type = type;
                this.children = [];
            }

            return StrategicItem;
        }
);