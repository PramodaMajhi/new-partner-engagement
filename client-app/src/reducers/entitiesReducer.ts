import { GET_STARTED, GET_SUCCESS, INSERT_SUCCESS, GET_FAILURE } from '../actions/types';


export const getDefaultEntities = () => {
    const entities = ['vendors']
    const def = {}
    entities.forEach(e => {
        def[e] = {
            fetching: false,
            loaded: false,
            loadedAt: 0,
            data: [],
            error: ''
        }
    })
    return def
}

export const entitiesData = (state = getDefaultEntities(), action) => {
    switch (action.type) {
        case GET_STARTED:
            {
                const { entityName } = action
                const entity = state[entityName]
                const overlay = { fetching: true, error: null }
                const newEntity = { ...entity, ...overlay }
                const newState = { ...state, ...{ [entityName]: newEntity } }
                return newState
            }

        case GET_SUCCESS:
            {
                const { entityName, response, replace } = action
                const entityColl = state[entityName]
                const overlay = { fetching: false, loaded: true, loadedAt: new Date(Date.now()), error: null }
                const newEntityColl = { ...entityColl, ...overlay }
                newEntityColl.data = response
                const newState = { ...state, ...{ [entityName]: newEntityColl } }
                return newState
            }

        case INSERT_SUCCESS: {
            const { entityName, error, response } = action
            const entityColl = state[entityName]
            const newData = response
            const overlay = { data: newData, fetching: false, loaded: true, loadedAt: Date.now(), error: null }
            const newEntityColl = { ...entityColl, ...overlay }
            const newState = { ...state, ...{ [entityName]: newEntityColl } }
            return newState
        }

        case GET_FAILURE: {
            const {entityName, error} = action
            const entityColl = state[entityName]
            const overlay = { fetching: false, error: (error || 'No error detail available') }
            const newEntityColl = { ...entityColl, ...overlay }
            const newState = { ...state, ...{ [action.entityName]: newEntityColl } }
            return newState
          }
    }

    return state
}