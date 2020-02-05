/**
 * This is the main js file of the application.
 * The library generated by webpack is called Client
 * The application is initiated by calling octo.init()
*/

/**
* The model holds all the front end data
*/
const model = {
    darkSkyClimaconMap: [
        {
            'darkcon': 'clear-day',
            'climacon': 'sun'
        }, {
            'darkcon': 'clear-night',
            'climacon': 'moon'
        }, {
            'darkcon': 'cloudy',
            'climacon': 'cloud'
        }, {
            'darkcon': 'partly-cloudy-day',
            'climacon': 'cloud sun'
        }, {
            'darkcon': 'partly-cloudy-night',
            'climacon': 'cloud moon'
        }, {
            'darkcon': 'thunderstorm',
            'climacon': 'lightning'
        }
    ],
    travels: [],
    notes: []
}

/**
 * octo short for octopus is in charge of connecting the view to the 
 * model. In particular will handle all the interactions between 
 * DOM elements, backend API and client data.
*/
const octo = {
    init: function () {
        view.init()
    },
    /**
     * Function taken from Stackoverflow https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     * @returns {string} uuid v4 - 16chars
     */
    uuidv4: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
    * Add new travel plan in the model and localStorage
    * @param {array} data Array of objects containing user inputs
    * @returns {string} uuid of the newly added travel 
    */
    addTravelPlan: (data) => {
        if (!data) return false
        const obj = {}
        obj.id = octo.uuidv4()
        obj.data = data
        model.travels.push(obj)
        octo.saveToLocalStorage('travels', model.travels)
        return obj.id
    },

    /**
     * get travel data from the model.
     * @param {string} [uuidv4] optional id, if no id is provided the
     *                          function returns all the travels in the
     *                          model 
     * @returns {array} 
    */
    getTravelPlan: (id) => {
        if (!id) return model.travels
        return model.travels.filter((el) => el.id === id)
    },

    /**
     * delete a travel plan from the model
     * @param {string} id travel id uuid4
     * @returns {boolean} 
    */
    deleteTravelPlan: (id) => {
        if (!id) return false
        const index = model.travels.findIndex((elem) => elem.id === id)
        if (index === -1) return false
        
        // delete travel from local model
        model.travels.splice(index, 1)

        // update localStorage
        octo.saveToLocalStorage('travels', model.travels)
        return true
    },

    /**
     * Update the travel in the local data model and localStorage
     * @param {string} id uuidv4 of the travel plan to update
     * @param {object} data array of objects containing the user inputs
     * 
     * @returns {boolean}
     */
    editTravelPlan: (id, data) => {
        if (!id) return model.travels
        const index = model.travels.findIndex((elem) => elem.id === id)
        if (index === -1) return false

        const obj = {}
        obj.id = id
        obj.data = data
        model.travels[index] = obj

        // update localStorage
        octo.saveToLocalStorage('travels', model.travels)
        return true
    }, 

    /**
     * arrayToKeyedObj takes an array and returns a keyed object based
     * on the key passed as parameter 
     * @param {array} array array of objects with data to be converted
     * @param {string} key key of the inner object to access the value needed
     *                     to the keyed json. 
     *                     Example:
     *                       input array [{name: "Piervalerio", city: "Miami"}]
     *                       if the key is name, the output will be
     *                       {Piervalerio: {name: "Piervalerio", city: "Miami"}}
     * @returns {Object} empty object if the arguments are not provided
    */
    arrayToKeyedObj: (array, key) => {
        if (!key || !array || array.length === 0) return {}
        const obj = {}
        $.each(array, function (index, elem) {
            const objKey = elem[key] || index
            obj[objKey] = elem
        })
        return obj
    },

    /**
     * @param {String} darkSkyIcon icon specification returned by darksky api
     * 
     * @returns {String} returns the matching climacon icon
     */
    getClimacons: (darkSkyIcon) => {
        if (!darkSkyIcon || darkSkyIcon.trim().length < 1) return ''
        const odds = model.darkSkyClimaconMap
        const found = odds.find(elem => elem.darkcon === darkSkyIcon)
        if (found) {
            return found.climacon
        }
        return darkSkyIcon
    },

    getCardinalDirection: (angle) => {
        if (angle > 11.25 && angle < 33.75) {
            return "NNE";
        } else if (angle > 33.75 && angle < 56.25) {
            return "ENE";
        } else if (angle > 56.25 && angle < 78.75) {
            return "E";
        } else if (angle > 78.75 && angle < 101.25) {
            return "ESE";
        } else if (angle > 101.25 && angle < 123.75) {
            return "ESE";
        } else if (angle > 123.75 && angle < 146.25) {
            return "SE";
        } else if (angle > 146.25 && angle < 168.75) {
            return "SSE";
        } else if (angle > 168.75 && angle < 191.25) {
            return "S";
        } else if (angle > 191.25 && angle < 213.75) {
            return "SSW";
        } else if (angle > 213.75 && angle < 236.25) {
            return "SW";
        } else if (angle > 236.25 && angle < 258.75) {
            return "WSW";
        } else if (angle > 258.75 && angle < 281.25) {
            return "W";
        } else if (angle > 281.25 && angle < 303.75) {
            return "WNW";
        } else if (angle > 303.75 && angle < 326.25) {
            return "NW";
        } else if (angle > 326.25 && angle < 348.75) {
            return "NNW";
        } else {
            return "N";
        }
    },

    /**
     * 
     * @param {Object} options Required options to generate the template
     * @param {string} options.travelId uuidV4 of the travel
     * @param {object} options.inputs User inputs in keyed object
     * @param {object} options.depMoment Moment object of the departure data
     * @param {boolean} [update=false] If true the function returns only the 
     *                                 cardFront template 
     * @returns {string}
     */
    cardTemplate: (options, update=false) => {
        if (!options.travelId || !options.inputs || !options.depMoment) {
            return console.log('Missing options')
        }
        const inputs = options.inputs
        const timeToNow = moment().to(options.depMoment)
        const destination = inputs.travelDestination.value
        let arrDate = "N/A"
        const duration = moment(inputs.retDate.value, 'MM/DD/YYYY ')
            .diff(options.depMoment, 'days')
        if (inputs.arrDate.value !== "") {
            const arrMoment = moment(`${inputs.arrDate.value} ${inputs.arrivalTime.value}`, 'MM/DD/YYYY HH:mm')
            arrDate = arrMoment.format('DDMMM').toUpperCase()
        }
        const cardFront = `
        <div class='card-front'>
            <div class="card-backdrop"></div>
            <div class="card-container">
                <h2 class="card-head" data-destination="${destination}">
                ${duration} days to ${destination}
                </h2>
                <div class="card-important">Departing:</div>
                <div>${options.depMoment.format('MMM DD, YYYY')} - ${timeToNow}</div>
                <hr class="separator">
                <div class="card-info-group">
                    <div>
                        <h6>Flight Details:</h6>
                        <button class="btn-warning edit-card">Edit</button>
                    </div>
                    <div class="card-group">
                        <div class="info-note">Origin</div>
                        <div class="text-uppercase">
                        ${inputs.flightOrigin.value} ${options.depMoment.format('DDMMM')} ${inputs.originTime.value}
                        </div>
                        <div class="info-note">Destination</div>
                        <div class="text-uppercase">
                        ${inputs.flightDestination.value} ${arrDate} ${inputs.arrivalTime.value}
                        </div>
                        <div>${inputs.airline.value} ${inputs.flightNumber.value}</div>
                    </div>
                </div>
                <hr class="separator">
                <div class="card-group weather">
                    <div class="card-important">
                    <span>Tipical</span> weather for travel date</div>
                </div>
                <div class="note-group">
                    <button class="btn-primary note-btn">
                        <span class="fas fa-plus"></span>
                        <span>Add Note</span>
                    </button>
                </div>
            </div>
        </div>
        `
        if(update) return cardFront
        return `<div class="card" data-travelid="${options.travelId}">
            <span class="delete-button fas fa-trash-alt"></span>
            <div class='card-inner'>
                ${cardFront}
                <div class='card-back'>
                    <span class="close">&#10005;</span>
                    <h2 class='card-head'>Update travel plan</h2>
                </div>
            </div>
        </div>`
    },

    cardBackTemplate: (travelId, options) => {
        return `
            <form action="#" class='update-travel' data-travelid="${travelId}">
                <div class="input-group">
                    <label for="travelDestination" class="required">TRAVEL DESTINATION</label>
                    <input type="text" name="travelDestination" class="form-field" required 
                        value="${options.travelDestination.value}">
                </div>
                <div>Flight / Trip details</div>
                <div class="input-group">
                    <label for="flightOrigin" class="inner-label">ORIGIN (AIRPORT CODE)</label>
                    <input type="text" name="flightOrigin" class="inner-label-input form-field" 
                        value="${options.flightOrigin.value}">
                </div>
                <div class="input-group-inline">
                    <div class="form-group-inline w-60">
                        <label for="depDate" class="inner-label required">DEP DATE</label>
                        <input type="text" name="depDate"
                            class="datepicker inner-label-input form-field" required
                            value="${options.depDate.value}">
                    </div>
                    <div class="form-group-inline w-40">
                        <label for="originTime" class="inner-label required">TIME</label>
                        <input type="time" name="originTime" pattern="[0-9]{2}:[0-9]{2}"
                            placeholder="HH:MM" class="inner-label-input form-field" required
                            value="${options.originTime.value}">
                    </div>
                </div>

                <div class="input-group">
                    <label for="flightDestination" class="inner-label">DESTINATION (AIRPORT
                        CODE)</label>
                    <input type="text" name="flightDestination"
                        class="inner-label-input form-field"
                        value="${options.flightDestination.value}">
                </div>
                <div class="input-group-inline">
                    <div class="form-group-inline w-60">
                        <label for="arrDate" class="inner-label">ARR DATE</label>
                        <input type="text" name="arrDate"
                            class="datepicker inner-label-input form-field"
                            value="${options.arrDate.value}">
                    </div>
                    <div class="form-group-inline w-40">
                        <label for="arrivalTime" class="inner-label">TIME</label>
                        <input type="time" name="arrivalTime" pattern="[0-9]{2}:[0-9]{2}"
                            placeholder="HH:MM" class="inner-label-input form-field" 
                            value="${options.arrivalTime.value}">
                    </div>
                </div>
                <div class="input-group">
                    <label for="airline" class="inner-label">AIRLINE</label>
                    <input type="text" name="airline" class="inner-label-input form-field"
                    value="${options.airline.value}">
                </div>
                <div class="input-group">
                    <label for="flightNumber" class="inner-label">FLIGHT NUMBER</label>
                    <input type="text" name="flightNumber" class="inner-label-input form-field"
                    value="${options.flightNumber.value}">
                </div>

                <div class="input-group">
                    <label for="retDate" class="inner-label required">RET DATE</label>
                    <input type="text" name="retDate"
                        class="datepicker inner-label-input form-field" required
                        value="${options.retDate.value}">
                </div>
                <input type="submit" class="btn btn-warning" value="Update travel">
            </form>
        `
    },

    getNote: (noteId) => {
        if(!noteId) return false
        return model.notes.filter((note, index) => {
            note.index = index
            if(note.noteId === noteId) return { ...note }
        })
    },

    addNote: (travelId, noteId, noteText) => {
        const note = octo.getNote(noteId)
        if(note.length > 0) {           
            return octo.editNote(note[0].noteId, noteText, note[0].index)
        }
        
        const noteObj = {
            travelId,
            noteId,
            noteText
        }

        model.notes.push(noteObj)
        // update localStorage
        octo.saveToLocalStorage('notes', model.notes)
        
        return true
    },

    editNote: (noteId, newNoteText, index=false) => {       
        if(index) {
            model.notes[index].noteText = newNoteText
            return true
        }

        if (!noteId) return false
        const idx = model.notes.findIndex((elem) => elem.noteId === noteId)
        if (idx === -1) return false

        model.notes[idx].noteText = newNoteText
        return true
    },

    /** 
     * function taken from MDN docs. It checks if local or session storage is
     * available
     * @param {string} [type=localStorage] The type of storage to check ex.: 'localStorage'
     *                                     default 'localStorage'
     * @returns {boolean | DOMException}                      
    */
    storageAvailable: function (type = 'localStorage') {
        let storage;
        try {
            storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    },

    /**
     * @param {name} name The name to be used by the setItem function
     * @param {array} value 
     * 
     * @returns {boolean}
     */
    saveToLocalStorage: (name, value) => {
        try {
            // Clear all values previously saved
            localStorage.removeItem(name);

            if (octo.storageAvailable()) {
                localStorage.setItem(name, JSON.stringify(value))
                return true;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    /**
     * @param {string} name Name of data element to search in localStorage for
     * @param {string} [modelKey = name] Key to assign the data into the model object
     *                                   By default is the same as the name 
     * @returns {object} 
    */
    readFromLocalStorage: (name, modelKey = name) => {
        if (!name || name.trim() === '') return false
        const data = localStorage.getItem(name)
        if (data) {
            const parsedData = JSON.parse(data);
            // update the local model
            model[modelKey] = parsedData
            return parsedData
        }
    }

}

/**
 * The view object contains all the functions necessary to update the 
 * DOM  
 * 
*/
const view = {
    init: () => {
        // Wait until the DOM is fully loaded before initializing the view
        document.addEventListener('DOMContentLoaded', () => {
            view.updateContainerHeight()
            window.onresize = () => {
                view.updateContainerHeight()
            }

            view.displaySavedTravels()

            // To initialize a datepicker (jQuery UI plugin), make sure you
            // add the 'datepicker' class to the text input
            $('.datepicker').datepicker()

            // Add event listeners
            view.handleNote()
            view.showNewTravel()
            view.addNewTravel()
            view.closeNewCard()
            view.deleteCard()
            view.editTravel()
        })
    },

    /**
     * Dynamycally update the card containers height when the content 
     * exceeds the card height
     * 
    */
    updateContainerHeight: () => {
        const containers = document.querySelectorAll('.card-container')
        for (let i = 0; i < containers.length; i++) {
            const parent = containers[i].closest('.card')
            const containerHeight = containers[i].offsetHeight
            parent.style.height = containerHeight
        }
    },

    handleNote: () => {
        // Don't use arrow function otherwise this won't be accessible
        $('#mainContainer').on('click', '.note-btn', function (e) {
            e.stopPropagation()
            e.preventDefault()
            const travelId = $(this).parents('.card').data('travelid')
            const textArea = $('<textarea>')
            textArea.addClass('note-text')
            const noteId = octo.uuidv4()
            const noteForm = `
                <form action="#" data-noteid="${noteId}" class="note-form" data-travelid="${travelId}">
                    <textarea name="noteText" class='note-text' spellcheck="true"></textarea>
                    <div>
                        <button class="btn btn-danger delete-note">
                            <span class="fas fa-trash-alt"></span>
                        </button>
                        <button type="submit" class="btn btn-primary add-note">
                            <span class="fas fa-plus"></span>
                        </button>
                    </div>
                </form>
            `
            $(this).parent().append(noteForm)
            view.updateContainerHeight()
            view.addNote(`[data-noteid="${noteId}"]`, travelId)
        })

        // Event listener to delete the notes
        $('#mainContainer').on('click', '.delete-note', function (e) {
            e.stopPropagation()
            e.preventDefault()
            $(this).parents('form').remove()
            view.updateContainerHeight()
        })
    },

    /**
     * @param {string} cardSelector inner card selector
     * @param {string} btnSelector button that triggers the event (optional)
     *                             pass undefined or null if you just want to 
     *                             close the card
     * @param {int} angle angle in degrees that defines how much the card 
     *                    should be rotated
     * @param {function} callback callback function
     */
    flipCard: (cardSelector, btnSelector, angle, callback) => {
        if (!btnSelector) {
            $(cardSelector).css('transform', `rotateY(${angle}deg)`)
        }
        $(btnSelector).on('click', function (e) {
            e.preventDefault()
            $(cardSelector).css('transform', `rotateY(${angle}deg)`)
        })
        if (callback) {
            callback()
        }
    },

    showNewTravel: () => {
        view.flipCard('.new-card-inner', '.new-card-btn', 180)
    },

    closeNewCard: () => {
        $('#mainContainer').on('click', '.close', function(e) {
            e.preventDefault()          
            $(this).parents('.card-inner, .new-card-inner')
                .css('transform', 'rotateY(0deg)')
        })
    },

    editTravel: () => {
        $('#mainContainer').on('click', '.edit-card', function (e) {
            e.preventDefault()
            const travelId = $(this).parents('.card').data('travelid')
            const travelPlan = octo.getTravelPlan(travelId)[0]
            const inputs = octo.arrayToKeyedObj(travelPlan.data, 'name')
            const cardBack = $(this).parents('.card-front').siblings('.card-back')
            cardBack.find('form').remove()
            cardBack.append(octo.cardBackTemplate(travelId, inputs))   

            //Re-inizialize the datapicker
            $('.datepicker').datepicker()
            view.flipCard($(this).parents('.card-inner'), undefined, 180)
            
        })

        view.displayEditedTravel()
    },

    displayEditedTravel: () => {
        $('#mainContainer').on('submit', '.update-travel', function(e) {
            e.preventDefault()
            const travelId = $(this).data('travelid')
            const userInputs = $(this).serializeArray()
            if(!octo.editTravelPlan(travelId, userInputs)) {
                return $.alert({
                    theme: 'material',
                    title: 'Error!',
                    content: 'An error occurred. Unable to update travel',
                    useBootstrap: false,
                    boxWidth: '50%',
                });
            }
            const inputs = octo.arrayToKeyedObj(userInputs, 'name')
            const depMoment = moment(`${inputs.depDate.value} ${inputs.originTime.value}`, 'MM/DD/YYYY HH:mm')
            const destination = inputs.travelDestination.value
            const duration = moment(inputs.retDate.value, 'MM/DD/YYYY ').diff(depMoment, 'days')
            if (!view.datesValidation(duration, "[name='retDate']")) return

            const cardInner = $(this).parents('.card-inner')
            cardInner.find('.card-front').remove()
            cardInner.append(
                octo.cardTemplate({ travelId, inputs, depMoment }, true)
                )
            view.flipCard($(this).parents('.card-inner'), undefined, 0)
                
            view.updateContainerHeight()
            window.scrollTo({ top: 100, left: 100, behavior: 'smooth' })
            Client.apiHandler.getWeather(destination, depMoment)
                .then((data) => {
                    view.displayWeather(travelId, data)
                })

            Client.apiHandler.getImages(destination)
                .then((data) => {
                    view.updateBackgroundImage(travelId, data)
                })
        })
    },

    /**
     * @param {int} duration
     * @param {string} retDateSelector jquery selector of the return 
     *                                 date input element
     * @returns {boolean}
     */
    datesValidation: (duration, retDateSelector) => {
        if (duration < 0) {
            $.alert({
                title: 'Invalid Date',
                theme: 'material',
                content: 'The return date is earlier than the departure date.',
                useBootstrap: false,
                boxWidth: '50%',
            })
            $(retDateSelector).val("")
            return false
        }
        return true
    },

    /**
     * @param {string} travelid uuid v4
     * @param {array} imgData response data from pixabay api
     * 
     * @returns {boolean}
    */
    updateBackgroundImage: (travelid, imgData) => {
        if (!travelid || !imgData || imgData.totalHits === 0) return false
        const $imgDiv = $(`[data-travelid=${travelid}]`).find('.card-backdrop')
        // no img div found
        if ($imgDiv.length === 0) return false

        const hits = imgData.hits
        $imgDiv.css('background-image', `url("${hits[0].webformatURL}")`)
        return true
    },

    /**
     * @param {string} travelId uuid v4 of the travel
     * @param {Object} weatherData response from DarkSky API
     */
    displayWeather: (travelId, weatherData) => {
        const $div = $(`[data-travelid=${travelId}]`).find('.weather')
        if (!travelId || !weatherData) {
            $div.next().text('Unable to update weather information.')
            return
        }
        const $header = $div.find('.card-important').find('span')

        // Departure date within 3 days from today
        weatherData.daily.data.length > 1 ? $header.text('Forecasted') : $header.text('Tipical')

        const $container = $('<div>').addClass('card-info-group')
        $.each(weatherData.daily.data, (index, elem) => {
            $container.append(`
                <div class="weather-group">
                    <div class="weather-date">
                        ${moment.unix(elem.time).format('MMM DD')}
                    </div>    
                    <div class='icon'>
                        <span class="fs1 climacon ${octo.getClimacons(elem.icon)}"></span>
                    </div>
                    <div class="d-flex justify-center">
                     <span class="min">${Math.floor(elem.temperatureLow)}
                    </span><span class="unit">°C</span>
                    <span class="max">${Math.floor(elem.temperatureHigh)}
                    </span><span class="unit">°C</span>
                    </div>  
                    <div class='d-flex justify-center'>
                        ${octo.getCardinalDirection(elem.windBearing)}|${(elem.windSpeed * 3.6).toFixed()}
                        <span class="unit">km/h</span></div>
                </div>`)
        })
        $div.append($container)
        view.updateContainerHeight()
    },

    addNewTravel: () => {
        $('#newTravel').on('submit', function (event) {
            event.preventDefault();
            const userInputs = $(this).serializeArray()
            const id = octo.addTravelPlan(userInputs)
            const inputs = octo.arrayToKeyedObj(userInputs, 'name')
            const depMoment = moment(`${inputs.depDate.value} ${inputs.originTime.value}`, 'MM/DD/YYYY HH:mm')
            const destination = inputs.travelDestination.value
            const duration = moment(inputs.retDate.value, 'MM/DD/YYYY ').diff(depMoment, 'days')
            if (!view.datesValidation(duration, "[name='retDate']")) return
            view.flipCard('.new-card-inner', undefined, 0, () => {
                $('.new-card-btn').css('opacity', '1')
            })
            $('#mainContainer').prepend(
                octo.cardTemplate({ travelId: id, inputs, depMoment })
            )

            view.updateContainerHeight()
            window.scrollTo({ top: 100, left: 100, behavior: 'smooth' })
            Client.apiHandler.getWeather(destination, depMoment)
                .then((data) => {
                    view.displayWeather(id, data)
                })

            Client.apiHandler.getImages(destination)
                .then((data) => {
                    view.updateBackgroundImage(id, data)
                })
        })
    },

    addNote: (selector, travelId) => {
        if(!selector || !travelId) return false
        $(selector).on('submit', function (e) {
            e.preventDefault()
            const noteId = $(this).data('noteid')
            const noteText = $(this).find('textarea').val().trim()
            octo.addNote(travelId, noteId, noteText)
        })
    },

    displaySavedTravels: () => {
        const travels = octo.readFromLocalStorage('travels')
        if (travels) {
            $.each(travels, (index, travel) => {
                const inputs = octo.arrayToKeyedObj(travel.data, 'name')
                const depMoment = moment(`${inputs.depDate.value} ${inputs.originTime.value}`, 'MM/DD/YYYY HH:mm')
                const destination = inputs.travelDestination.value
  
                $('#mainContainer').prepend(
                    octo.cardTemplate({ travelId: travel.id, inputs, depMoment })
                )
                view.updateContainerHeight()
                Client.apiHandler.getWeather(destination, depMoment)
                    .then((data) => {
                        view.displayWeather(travel.id, data)
                    })

                Client.apiHandler.getImages(destination)
                    .then((data) => {
                        view.updateBackgroundImage(travel.id, data)
                    })
            })
        }
    },

    deleteCard: () => {
        $('#mainContainer').on('click', '.delete-button', function (event) {
            event.preventDefault()
            const deleteBtn = $(this)
            const destination = $(this).siblings('.card-inner').find('.card-head').data('destination')
            const travelId = deleteBtn.parent().data('travelid')
            $.confirm({
                theme: 'material',
                title: 'Delete trip',
                content: `Are you sure you want to delete your trip to ${destination}?`,
                confirmButtonClass: 'btn-danger',
                useBootstrap: false,
                boxWidth: '50%',
                buttons: {
                    delete: {
                        text: 'Delete',
                        btnClass: 'btn-danger',
                        keys: ["enter"],
                        action: () => {
                            $('.new-card').css('height', '400px')
                            $(deleteBtn).parent().remove()
                            octo.deleteTravelPlan(travelId)
                        }

                    },
                    cancel: () => {
                        return
                    }
                }
            })
        })
    }

}

// Export the application. In order to initiate the app, call 
// octo.init() in your webpack js entry file (index.js)
export { octo }