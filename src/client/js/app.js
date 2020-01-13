/**
 * This is the main js file of the application.
 * The library generated by webpack is called Client
 * The application is initiated by calling octo.init()
*/

/**
* The model holds all the front end data
*/
const model = {
    travels: {}
}

/**
 * octo short for octopus is in charge of connecting the view to the 
 * model. In particular will handle all the interactions between 
 * DOM elements, backend API and client data.
*/
const octo = {
    init: () => {
        view.init()
    },
    /**
     * Function taken from Stackoverflow https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     * @returns {string} uuid v4 - 16chars
     */
    uuidv4:() => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },

    /**
    * Add new travel plan
    * @param {array} data Array of objects containing user inputs
    * @returns {string} uuid of the newly added travel 
    */ 
    addTravelPlan: (data) => {
        if(!data) return false
        const obj = {}
        obj.id = octo.uuidv4()
        obj.data = data
        model.travels = obj
        return obj.id
    },

    /**
     * get travel data from the model.
     * @param {string} [uuidv4] optional id, if no id is provided the
     *                          function returns all the travels in the
     *                          model 
     * @returns {Object || undefined}
    */
    getTravelPlan: (id) => {
        if(!id) return model.travels
        return model.travels[id]
    },

    /**
     * delete a travel plan from the model
     * @param {string} uuidv4 travel id
     * @returns {boolean} 
    */
    deleteTravelPlan: (id) => {
        if(!id) return false
        if(model.travels[id]) {
            return delete model.travels[id]
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

            // To initialize a datepicker (jQuery UI plugin), make sure you
            // add the 'datepicker' class to the text input
            $('.datepicker').datepicker()

            view.handleNote()
            view.showNewTravel()
            view.addNewTravel()
            view.closeNewCard()
            view.deleteCard()
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
            const parent = containers[i].parentElement
            // const imgHeight = containers[i].previousElementSibling.offsetHeight
            const containerHeight = containers[i].offsetHeight
            parent.style.height = containerHeight
        }
    },

    handleNote: () => {
        // Don't use arrow function otherwise this won't be accessible
        $('#mainContainer').on('click', '.note-btn', function (e) {
            e.stopPropagation()
            e.preventDefault()
            const textArea = $('<textarea>')
            textArea.addClass('note-text')
            $(this).parent().append(textArea)
                .append('<span class="fas fa-trash-alt delete-note btn btn-danger"></span>')
            view.updateContainerHeight()
        })

        // Event listener to delete the notes
        $('#mainContainer').on('click', '.delete-note', function (e) {
            e.stopPropagation()
            e.preventDefault()
            $(this).prev('.note-text').remove()
            $(this).remove()
            view.updateContainerHeight()
        })
    },

    showNewTravel: () => {
        view.flipCard('.new-card-inner', '.new-card-btn', 180, ()=> {
            $('.new-card-btn').css('opacity', '1')
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
        if(!btnSelector) {
            $(cardSelector).css('transform', `rotateY(${angle}deg)`)
        }
        $(btnSelector).on('click', function(e) {
            e.preventDefault()
            $(cardSelector).css('transform', `rotateY(${angle}deg)`)
            if(callback) {
                callback()
            }
        })
    },

    closeNewCard: () => {
        view.flipCard('.new-card-inner', '#closeNewCard', 0, ()=> {
            $('.new-card-btn').css('opacity', '1')
        })
    },

    addNewTravel: () => {
        $('#newTravel').on('submit', function (event) {
            event.preventDefault();
            view.flipCard('.new-card-inner', undefined, 0, ()=> {
                $('.new-card-btn').css('opacity', '1')
            })
            const userInputs = $(this).serializeArray()
            octo.addTravelPlan(userInputs)
            console.log(model)
        })
    },

    deleteCard: () => {
        $('.delete-button').on('click', function(event) {
            event.preventDefault()
            const deleteBtn = $(this)
            const destination = $(this).siblings('.card-container').find('.card-head').data('destination')
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