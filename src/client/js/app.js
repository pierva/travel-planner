/**
 * This is the main js file of the application.
 * The library generated by webpack is called Client
 * The application is initiated by calling octo.init()
*/

/**
* The model holds all the front end data
*/
const model = {

}

/**
 * octo short for octopus is in charge of connecting the view to the 
 * model. In particular will handle all the interactions between 
 * DOM elements, backend API and client data.
*/
const octo = {
    init: () => {
        view.init()
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
        $('#newTravel').on('submit', (event) => {
            event.preventDefault();
            // $('.new-card-inner').css('transform', 'rotateY(0deg)')
            // $('.new-card-btn').css('opacity', '1')
            view.flipCard('.new-card-inner', undefined, 0, ()=> {
                $('.new-card-btn').css('opacity', '1')
            })
        })
    }
    
}

// Export the application. In order to initiate the app, call 
// octo.init() in your webpack js entry file (index.js)
export { octo }