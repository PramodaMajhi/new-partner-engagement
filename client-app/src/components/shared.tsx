export interface IOption {
    value: number,
    label: string,
    disabled?: boolean
  }
    
  
  export const businessUnitOptions = [    
    { value: '0', label: 'Health Innovation Technology' },
    { value: '1', label: 'Dev Ops' },
    { value: '2', label: 'Finance' },
    { value: '3', label: 'Innovation' },
    { value: '4', label: 'HR' },
    { value: '5', label: 'Altais, Digital Experience' },
    { value: '6', label: 'Enterprise Architecture' },
    { value: '7', label: 'Health Reimagined' },
    { value: '8', label: 'Product' },
    { value: '9', label: 'Wellvolution' },
    { value: '10', label: 'Other' },                                    

  ]


  export const maturityLevelOptions = [    
    { value: '0', label: 'Seed' },
    { value: '1', label: 'Series A' },
    { value: '2', label: 'Series B' },
    { value: '3', label: 'Series C' },
    { value: '4', label: 'Series D+' },    
    { value: '5', label: 'Public' }, 
    { value: '6', label: 'Other (Specify)' }
  ]

  export const processStageOptions = [    
    { value: '0', label: 'Screening' },
    { value: '1', label: 'Concept' },
    { value: '2', label: 'Build/Trial' },
    { value: '3', label: 'Pilot' },
    { value: '4', label: 'Production' }    
  ]

  export const  PhaseEnum = {
    Filling: 0,
    Attaching:1,
    Submitting:2,
    Uploading: 3,
    Complete: 4
  }