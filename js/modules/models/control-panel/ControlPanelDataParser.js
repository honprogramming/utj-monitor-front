/**
 * 
 * @returns {ControlPanelDataParser_L5.ControlPanelDataParser}
 */
define([],
        function () {
            var ControlPanelDataParser = {
                /**
                 * 
                 * @param {type} data
                 * @returns {ControlPanelDataParser_L6.ControlPanelDataParser.createNode.ControlPanelDataParserAnonym$5}
                 */
                parse: function (data) {
                    var nodesMap = {};
                    var counter = 1;
                    var ejesNodes = [];
                    var objetivosNodes = [];
                    var indicadoresNodes = [];
                    
                    nodesMap[counter] = {node: data.vision, id: counter};
                    nodesMap[counter]["children"] = [];
                    var visionNode = this.createNode(data.vision.label, data.vision.name, data.vision.goal, data.vision.achieve, 360, counter++);
                    var ejes = data.vision.ejes;

                    for (var i = 0; i < ejes.length; i++) {
                        var eje = this.createNode(ejes[i].label, ejes[i].name, ejes[i].goal, ejes[i].achieve, ejes.length, counter);
                        var objetivos = ejes[i].objetivos;

                        nodesMap[counter] = {node: ejes[i], id: counter};
                        nodesMap[counter]["children"] = [];
                        nodesMap[visionNode.id]["children"].push(counter);
                        nodesMap[counter++]["parent"] = visionNode.id;
                        ejesNodes.push(eje);

                        for (var j = 0; j < objetivos.length; j++) {
                            var objetivo = this.createNode(objetivos[j].label, objetivos[j].name, objetivos[j].goal, objetivos[j].achieve, objetivos.length, counter);
                            var indicadores = objetivos[j].indicadores;

                            nodesMap[counter] = {node: objetivos[j], id: counter};
                            nodesMap[counter]["children"] = [];
                            nodesMap[eje.id]["children"].push(counter);
                            nodesMap[counter++]["parent"] = eje.id;
                            objetivosNodes.push(objetivo);

                            for (var z = 0; z < indicadores.length; z++) {
                                var indicador = this.createNode(indicadores[z].label, indicadores[z].name, indicadores[z].goal, indicadores[z].achieve, indicadores.length, counter);
                                nodesMap[counter] = {node: indicadores[z], id: counter};
                                nodesMap[objetivo.id]["children"].push(counter);
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

                    return {map: nodesMap, tree: visionNode};
                },
                /**
                 * 
                 * @param {type} label
                 * @param {type} goal
                 * @param {type} achieve
                 * @param {type} length
                 * @param {type} id
                 * @returns {ControlPanelDataParser_L6.ControlPanelDataParser.createNode.ControlPanelDataParserAnonym$5}
                 */
                createNode: function (label, name, goal, achieve, length, id) {
                    return {
                        label: label,
                        id: id,
                        value: 360 / length,
                        color: this.getColor(goal, achieve),
                        borderWidth: 2,
                        shortDesc: "&lt;b&gt;" + name +
                                "&lt;/b&gt;&lt;br/&gt;Meta: " +
                                goal + "&lt;br/&gt;Avance: " + achieve};
                },
                /**
                 * 
                 * @param {type} parent
                 * @param {type} childNodes
                 * @returns {undefined}
                 */
                addChildNodes: function (parent, childNodes) {
                    parent.nodes = [];
                    for (var i = 0; i < childNodes.length; i++) {
                        parent.nodes.push(childNodes[i]);
                    }
                },
                /**
                 * 
                 * @param {type} goal
                 * @param {type} achieve
                 * @returns {String}
                 */
                getColor: function (goal, achieve) {
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
            };
            
            return ControlPanelDataParser;
        }
);