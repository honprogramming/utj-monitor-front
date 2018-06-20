/**
 * This file contains an Object which serves as prototype for all View Model classes.
 * The properties in this Object will be inherited by all subclasses.
 * 
 * The most basic properties are:
 * 
 * bundle: The Resource Bundle to use in the app.
 * By default the bundle provided by JET is used.
 * 
 * converter: An object which can be configured for different numbers (currency, percentages, etc)
 * and uses JET bundle to format the input in different languages.
 * 
 * callListeners: A function to call all listeners of certain type that were 
 * added to caller component.
 * 
 * @param {Object} oj The ojcore library.
 * @returns {GeneralViewModel} The Object containing the basic properties for
 * a View-Model Object in Security Analytics.
 */
define(['ojs/ojcore', 'ojs/ojvalidation'],
        function (oj) {
//Code to create a converter.
            const numberConverterFactory = oj.Validation.converterFactory("number");
            const dateTimeConverterFactory = oj.Validation.converterFactory("datetime");
            const dateTimeOptions = {formatType: 'datetime', pattern: 'MMM d, y, h:mm a'};
            const dateOptions = {formatType: 'datetime', pattern: 'dd/MM/yy'};
            const monthOptions = {formatType: 'datetime', pattern: 'MMM y'};
            const yearOptions = {formatType: 'datetime', pattern: 'y'};
            const decimalOptions = {style: 'decimal', decimalFormat: 'short'};
            const percentOptions = {style: 'percent'};
            const yearDecimalOptions = {style: 'decimal', useGrouping: false};
            const integerOptions = {style: 'decimal', maximumFractionDigits: 0, useGrouping: true};
            const currencyOptions = {style: 'currency', currency: 'MEX'};
//    const percentOneFractionDigitOptions = {style: 'percent', maximumFractionDigits: 1};

            const GeneralViewModel = {
                converters: {
                    dateTime: dateTimeConverterFactory.createConverter(dateTimeOptions),
                    date: dateTimeConverterFactory.createConverter(dateOptions),
                    year: dateTimeConverterFactory.createConverter(yearOptions),
                    month: dateTimeConverterFactory.createConverter(monthOptions),
                    decimal: numberConverterFactory.createConverter(decimalOptions),
                    percent: numberConverterFactory.createConverter(percentOptions),
                    yearDecimal: numberConverterFactory.createConverter(yearDecimalOptions),
                    integer: numberConverterFactory.createConverter(integerOptions),
                    currency: numberConverterFactory.createConverter(currencyOptions)
//            percent_1: numberConverterFactory.createConverter(percentOneFractionDigitOptions),
                },
                listeners: [],
                /**
                 * General function to add listeners to current view model.
                 * 
                 * @param {Function} listener the Function to add.
                 * @param {Object} eventType The type of event to add.
                 */
                addListener: function (listener, eventType) {
                    var listeners = this.getListeners();

                    if (listeners[eventType] === undefined) {
                        listeners[eventType] = [];
                    }

                    listeners[eventType].push(listener);
                },
                /**
                 * Returns an Array with the listeners added to the View Model.
                 * 
                 * @param {String} eventType A String containing one of the event types
                 * listed in types/Events.
                 * @returns {Array} The Array containing the listeners functions for the
                 * current View Model Object.
                 */
                getListeners: function (eventType) {
                    if (eventType) {
                        return this.listeners[eventType];
                    }

                    return this.listeners;
                },
                /**
                 * Calls the listeners in the order they were added.
                 * 
                 * @param {EventType} eventType The constant indicating what event was triggered,
                 * in order to call the correct listeners.
                 * @param {String} value The value that triggered the event.
                 * @param {String} action An action bound to the event.
                 */
                callListeners: function (eventType, value, action) {
                    var eventListeners = this.getListeners(eventType);

                    if (eventListeners !== undefined && eventListeners instanceof Array) {
                        for (var i = 0; i < eventListeners.length; i++) {
                            eventListeners[i](value, action);
                        }
                    }
                },
                /**
                 * Translates a String to the current page language.
                 * 
                 * @param {String} key The text key to get and translate.
                 * @param {Object} params An Object with params to apply in case the
                 * message contains tokens to replace.
                 * @returns {String} The translated String.
                 */
                nls: function (key, params) {
                    return oj.Translations.getTranslatedString(key, params);
                }
            };

            return GeneralViewModel;
        }
);
