define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojsunburst'],
        function (oj, ko, $) {
            function Circular() {
                var self = this;
                var nodesMap = {};
                self.nodeValues = ko.observableArray([]);

                self.onClick = function (ui, data) {
                    if (data.option === "selection") {
                        var id = data.value[0];
                        var element = nodesMap[id];

                        console.log(element.node.name);
                        
                        while (element.parent != null) {
                            element = nodesMap[element.parent];
                            console.log(element.node.name);
                        } 
                    }
                };

                $.getJSON("data/circular.json",
                        function (data) {
                            self.nodeValues([parseData(data)]);
                        }
                );

                function parseData(data) {
                    var counter = 1;
                    var ejesNodes = [];
                    var objetivosNodes = [];
                    var indicadoresNodes = [];
                    
                    nodesMap[counter] = {node: data.vision};
                    var visionNode = createNode(data.vision.name, data.vision.goal, data.vision.achieve, 360, counter++);
                    var ejes = data.vision.ejes;

                    for (var i = 0; i < ejes.length; i++) {
                        var eje = createNode(ejes[i].name, ejes[i].goal, ejes[i].achieve, ejes.length, counter);
                        var objetivos = ejes[i].objetivos;
                        
                        nodesMap[counter++] = {node: ejes[i]};
                        ejesNodes.push(eje);

                        for (var j = 0; j < objetivos.length; j++) {
                            var objetivo = createNode(objetivos[j].name, objetivos[j].goal, objetivos[j].achieve, objetivos.length, counter);
                            var indicadores = objetivos[j].indicadores;
                        
                            nodesMap[counter] = {node: objetivos[j]};
                            nodesMap[counter++]["parent"] = eje.id;
                            objetivosNodes.push(objetivo);

                            for (var z = 0; z < indicadores.length; z++) {
                                var indicador = createNode(indicadores[z].name, indicadores[z].goal, indicadores[z].achieve, indicadores.length, counter);
                                nodesMap[counter] = {node: indicadores[z]};
                                nodesMap[counter++]["parent"] = objetivo.id;
                                indicadoresNodes.push(indicador);
                            }

                            addChildNodes(objetivo, indicadoresNodes);
                            indicadoresNodes = [];
                        }
                        
                        addChildNodes(eje, objetivosNodes);
                        objetivosNodes = [];
                    }

                    addChildNodes(visionNode, ejesNodes);

                    return visionNode;
                }

                function createNode(label, goal, achieve, length, id) {
                    return {
                        label: label,
                        id: id,
                        value: 360 / length,
                        color: getColor(goal, achieve),
                        shortDesc: "&lt;b&gt;" + label +
                                "&lt;/b&gt;&lt;br/&gt;Meta: " +
                                goal + "&lt;br/&gt;Avance: " + achieve};
                }

                function getColor(goal, achieve) {
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
                }

                function addChildNodes(parent, childNodes) {
                    parent.nodes = [];
                    for (var i = 0; i < childNodes.length; i++) {
                        parent.nodes.push(childNodes[i]);
                    }
                }
            }

            return Circular;
        }
);
