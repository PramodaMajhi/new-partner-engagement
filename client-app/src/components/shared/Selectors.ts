import { createSelector } from 'reselect'
import * as vendorsModel from '../../models/vendors'

export const searchFilterSel = (state: any) => state.values.searchVal
export const upload = (state: any) => state.values.upload

export const vendors = (state : any) => state.entitiesData.vendors.data.sort((a, b) => (a.vendorName > b.vendorName) ? 1 : (a.vendorName < b.vendorName) ? -1 : 0)


export const searchPartnersSel = createSelector(vendors, searchFilterSel, (vendors, searchFilter) => {    
    let result = vendorsModel.filterBySearch(vendors, searchFilter)      
    return result
  })
  
