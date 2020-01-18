import { octo } from './js/app'
import { apiHandler } from './js/apiHandler'
import './styles/resets.scss'
import './styles/base.scss'


const app = octo.init()

export {
    apiHandler,
    app
}