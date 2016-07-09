define([],
        function () {
            function ControlPanelDataParser(data) {
                this.nodesMap = {};
                this.data = data;
            }

            var prototype = ControlPanelDataParser.prototype;
            
            prototype.parseData = function () {
                var data = this.data;
                var nodesMap = this.nodesMap;
                var counter = 1;
                var ejesNodes = [];
                var objetivosNodes = [];
                var indicadoresNodes = [];

                nodesMap[counter] = {node: data.vision};
                var visionNode = this.createNode(data.vision.name, data.vision.goal, data.vision.achieve, 360, counter++);
                var ejes = data.vision.ejes;

                for (var i = 0; i < ejes.length; i++) {
                    var eje = this.createNode(ejes[i].name, ejes[i].goal, ejes[i].achieve, ejes.length, counter);
                    var objetivos = ejes[i].objetivos;

                    nodesMap[counter++] = {node: ejes[i]};
                    ejesNodes.push(eje);

                    for (var j = 0; j < objetivos.length; j++) {
                        var objetivo = this.createNode(objetivos[j].name, objetivos[j].goal, objetivos[j].achieve, objetivos.length, counter);
                        var indicadores = objetivos[j].indicadores;

                        nodesMap[counter] = {node: objetivos[j]};
                        nodesMap[counter++]["parent"] = eje.id;
                        objetivosNodes.push(objetivo);

                        for (var z = 0; z < indicadores.length; z++) {
                            var indicador = this.createNode(indicadores[z].name, indicadores[z].goal, indicadores[z].achieve, indicadores.length, counter);
                            nodesMap[counter] = {node: indicadores[z]};
                            nodesMap[counter++]["parent"] = objetivo.id;
                            indicadoresNodes.push(indicador);
                        }

                        this.addChildNodes(objetivo, indicadoresNodes);
                        indicadoresNodes = [];
                    }

                    this.addChildNodes(eje, objetivosNodes);
                    objetivosNodes = [];
                }

                this.addChildNodes(visionNode, ejesNodes);

                return visionNode;
            };

            prototype.createNode = function (label, goal, achieve, length, id) {
                return {
                    label: label,
                    id: id,
                    value: 360 / length,
                    color: this.getColor(goal, achieve),
                    shortDesc: "&lt;b&gt;" + label +
                            "&lt;/b&gt;&lt;br/&gt;Meta: " +
                            goal + "&lt;br/&gt;Avance: " + achieve};
            };

            prototype.addChildNodes = function (parent, childNodes) {
                parent.nodes = [];
                for (var i = 0; i < childNodes.length; i++) {
                    parent.nodes.push(childNodes[i]);
                }
            };

            prototype.getColor = function (goal, achieve) {
                var result = achieve / goal;

                if (result >= 0.9) {
                    return "#31B404";
                } else if (result >= 0.6) {
                    return "#D7DF01";
                } else if (result >= 0.4) {
                    return "#FE9A2E";
                } else {
                    return "#DF0101";
                }
            };

            return ControlPanelDataParser;
        }
);