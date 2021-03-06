export const CONF = {   

    VENDOR_FILES_ATTACH: {
        MAX_FILES: 3,
        MAX_FILE_SIZE: 10 * 1024 * 1024,
        MAX_FILE_SIZE_TEXT: "10MB",
        ALLOWED_MIME_TYPES: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/*'
        ],
    },  
    APP_API_URL:{
        API_URL: process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:3001/partnerengage-api/api'
    }   
}

