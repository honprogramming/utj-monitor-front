/**
 * Parses the data in order to populate the forms in the app.
 * Catalogs are passed as argument to the parse method and it will return an
 * array of objects. Each object will contain the corresponding catalogs for
 * the tab with same index than the element.
 * 
 * @returns {Object} The parser for the forms.
 */
define(
        [],
        function () {
            var FormsDataParser = {
                /**
                 * Parses the data from JSON format into an Array of
                 * Objects with theh catalogs of a form.
                 * Each Object will be a map with the name of the field and its
                 * correponding values.
                 * 
                 * @param {Object} data An Object in JSON format with the data
                 * to parse.
                 * @returns {Array} An Array containing maps as Objects with the
                 * values for the field.
                 */
                parse: function (data) {
                    return [data];
                }
            };

            return FormsDataParser;
        }
);