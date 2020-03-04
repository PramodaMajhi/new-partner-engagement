import * as rest from './rest'

import * as stages from '../models/stages'
import * as ideas from '../models/ideas'
import * as questions from '../models/questions'
import * as scores from '../models/scores'
import * as likes from '../models/likes'
import * as tasks from '../models/tasks'
import * as taskDetails from '../models/taskDetails'
import * as tags from '../models/tags'
import * as activities from '../models/activities'
import * as categories from '../models/categories'
import * as hitMembers from '../models/hitMembers'
import * as comments from '../models/comments'
import * as milestones from '../models/milestones'
import * as hitTeamMembers from '../models/hitTeamMembersWithDept'
import * as mentions from '../models/mentions'
import * as  relatedIdeas from '../models/relatedIdeas'
import * as  department from '../models/department'
import * as  employee from '../models/employee'


import {IFile} from '../models/types'

// a metaData object is exported by each model in the models directory

export interface ImetaData {
  list?: string,      // if it's a regular sharepoint list, use this and leave suffix undefined
  suffix?: string,    // if it's a suffix, use this and leave list undefined
  expand?: string[]
  fields?: string[],
  mapResponseFromServer?: any,
  mapRowToServer?: any,
  mapRowFromServer?: any,
  top?: number
}

const metaData : {[key: string]: ImetaData} = {
  likes: likes.getMetaData(),
  stages: stages.getMetaData(),
  ideas: ideas.getMetaData(),
  questions: questions.getMetaData(),
  scores: scores.getMetaData(),
  tasks: tasks.getMetaData(),
  taskDetails: taskDetails.getMetaData(),
  tags: tags.getMetaData(),
  activities: activities.getMetaData(),
  categories: categories.getMetaData(),
  hitMembers: hitMembers.getMetaData(),
  comments: comments.getMetaData(), 
  milestones: milestones.getMetaData(),
  hitTeamMembers: hitTeamMembers.getMetaData(),
  publicComments: comments.getMetaDataPublicComments(), // public comments
  mentions: mentions.getMetaData(),
  relatedIdeas: relatedIdeas.getMetaData(),
  department: department.getMetaData(),
  employee: employee.getMetaData(),
}

export const get = (entityName: string, filter: Object | Object[]) => {
  let mData = metaData[entityName]
  
  let endpoint : {list?: string, suffix?: string} = {}
  if ('list' in mData) {
    endpoint.list = mData.list
  } else {
    endpoint.suffix = mData.suffix
  }

  let expand
  ('expand' in mData) ? expand = mData.expand : expand = []

  let fields
  ('fields' in mData) ? fields = mData.fields : fields = []

  let top
  ('top' in mData) ? top = mData.top : top = 1000

  const {mapResponseFromServer} = mData

  let promise = rest.getEntity(endpoint, expand, fields, filter, top)
    .then(obj => {
        if (obj.value) {
          obj = obj.value
        }
        return mapResponseFromServer(obj)
      })
    return promise;
}

let digest:string = null
let timeOut = null

const getFormDigest = () : Promise<string> => {
  if (digest && Date.now() < timeOut) {
    return Promise.resolve(digest)
  }
  let promise = rest.post('contextinfo')
    .then(obj => {
      digest = obj.FormDigestValue
      let seconds =  obj.FormDigestTimeoutSeconds
      timeOut =  Date.now() + seconds * 1000
      return digest
    })
  return promise
}

export const insert = (entityName: string, entity) => {
  const {list, mapRowToServer, mapRowFromServer} = metaData[entityName]
  const newEntity = mapRowToServer(entity)
  let promise = getFormDigest()
    .then (digest => {
        let promise = rest.insert(digest, list, newEntity)
          .then(row => 
                      mapRowFromServer(row))  // separate line enable breakpoint
        return promise
    })
  return promise
}

// for now, update requires that the field names use the Server field names.
// ToDo: map field names
export const merge = (entityName: string, entity: {Id: number, [propName: string]: any}) => {
  const {list} = metaData[entityName]
  let promise = getFormDigest()
    .then (digest => {
        // merge will not return a body, so just return the entity which was passed
        let promise = rest.merge(digest, list, entity)
          .then(noResponse => 
                              entity)
        return promise
      })
  return promise
}

export const remove = (entityName: string, id: number) => {
    const {list} = metaData[entityName]
    let promise = getFormDigest()
      .then(digest => {
        let promise = rest.remove(digest, list, id)
        return promise
      })
    return promise
}

export const upload = (entityName: string, id: number, file: IFile, callback: (percent) => void) => {
  const {list} = metaData[entityName]
  let promise = getFormDigest()
    .then (digest => {
        let promise = rest.upload(digest, list, id, file, callback)
        return promise
    }) 
  return promise
}

export const removeAttachment = (entityName: string, id: number, fileName: string) => {
  const {list} = metaData[entityName]
  let promise = getFormDigest()
    .then (digest => {
        let promise = rest.removeAttachment(digest, list, id, fileName)
        return promise
    }) 
  return promise
}

// Getting users based on iput criteria
export const startGettingUsers = (name: string) => { 
  let promise = getFormDigest()
    .then (digest => {
        let promise = rest.startGettingUsers(digest, name)
        return promise
    }) 
  return promise
}