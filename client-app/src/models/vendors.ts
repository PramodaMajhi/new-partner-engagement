

export const filterBySearch = (vendors, searchVal: string) => {
    if (!searchVal) {
        return vendors
    }

    const search = searchVal.trim().toLowerCase();

    let result = vendors.filter(v =>
        normalize(v.vendorName).includes(search)
        || normalize(v.processStage.label).includes(search)
        || normalize(v.vendorContact.name).includes(search)
        || normalize(v.keyFocusArea).includes(search)
        || v.businessUnit.find(b => {          
            return normalize(b.label).includes(search)
        })


    )  // note exact match, not partial
    return result
}

const normalize = (str) => {
    if (!str) {
        return ''
    }
    // remove special characters, replace groups of spaces with a single space and convert to upper case
    return str.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').toLowerCase()
}