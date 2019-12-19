const faker = require('faker');
const fs = require('fs');
let writeStream = fs.createWriteStream('./output.json');
let data = [];
let i = 2;

while(i < 100) {
    let vendorName = faker.company.companyName();
    let vendorContactName = faker.name.findName();
    let businessType = faker.random.objectElement(['Consumer Health & Wellness', 'Diagnostics: Imaging', 'Diagnostics: Pathology', 'Digital Therapeutics', 'Drug R&D', 'Genomics', 'Insurance & Benefits', 'Providers: Primary Care', 'Providers: Clinical Tools']);
    let engagementLevel = faker.random.objectElement(['Initial Engagement', 'NDA signed', 'Proof of Concept', 'Pilot'])
    let events = [];

    if(engagementLevel === 'Initial Engagement'){
        events = [
            {
                date: faker.date.between('2019-07-01', '2019-11-30'),
                text: 'Made initial contact with ' + vendorName + ' at HIMMS. Spoke with ' + vendorContactName + ' regarding their offering in ' + businessType + '.'
            },
            {
                date: faker.date.between('2019-12-01', '2019-12-19'),
                text: 'Followed up with ' + vendorContactName + ' and experienced their product offering demo. Looks good! Recommended them to go through vendor assessment.'
            } 
        ]
    }

    if(engagementLevel === 'NDA signed'){
        events = [
            {
                date: faker.date.between('2019-01-01', '2019-06-30'),
                text: 'Made initial contact with ' + vendorName + ' at HIMMS. Spoke with ' + vendorContactName + ' regarding their offering in ' + businessType + '.'
            },
            {
                date: faker.date.between('2019-07-01', '2019-09-30'),
                text: 'Followed up with ' + vendorContactName + ' and experienced their product offering demo. Looks good! Recommended them to go through vendor assessment.'
            },
            {
                date: faker.date.between('2019-10-01', '2019-12-19'),
                text: 'NDA is signed. Next step is to start planing for PoC.'
            } 
        ]
    }

    if(engagementLevel === 'Proof of Concept'){
        events = [
            {
                date: faker.date.between('2019-01-01', '2019-06-30'),
                text: 'Made initial contact with ' + vendorName + ' at HIMMS. Spoke with ' + vendorContactName + ' regarding their offering in ' + businessType + '.'
            },
            {
                date: faker.date.between('2019-07-01', '2019-09-30'),
                text: 'Followed up with ' + vendorContactName + ' and experienced their product offering demo. Looks good! Recommended them to go through vendor assessment.'
            },
            {
                date: faker.date.between('2019-10-01', '2019-11-19'),
                text: 'NDA is signed. Next step is to start planing for PoC.'
            },
            {
                date: faker.date.between('2019-11-20', '2019-12-19'),
                text: 'PoC is in flight. Expected to be completed by ' + faker.date.soon + '.'
            }  
        ]
    }

    if(engagementLevel === 'Pilot'){
        events = [
            {
                date: faker.date.between('2019-01-01', '2019-06-30'),
                text: 'Made initial contact with ' + vendorName + ' at HIMMS. Spoke with ' + vendorContactName + ' regarding their offering in ' + businessType + '.'
            },
            {
                date: faker.date.between('2019-07-01', '2019-07-30'),
                text: 'Followed up with ' + vendorContactName + ' and experienced their product offering demo. Looks good! Recommended them to go through vendor assessment.'
            },
            {
                date: faker.date.between('2019-08-01', '2019-09-19'),
                text: 'NDA is signed. Next step is to start planing for PoC.'
            },
            {
                date: faker.date.between('2019-09-20', '2019-11-30'),
                text: 'PoC is in flight. Expected to be completed by ' + faker.date.recent() + '.'
            },
            {
                date: faker.date.between('2019-12-01', '2019-12-19'),
                text: 'PoC was successfully completed. Planning to pilot go-live'
            }
        ]
    }
    
    let record = {
        "vendorName": vendorName,
        "imageUrl": faker.image.cats(),
        "websitie": faker.internet.domainName(),
        "businessType": businessType,
        "businessUnit" : faker.random.objectElement(['Innovation', 'Health Innovation Technology', 'Business Process Management']),
        "vendorContact" : {
          "name": vendorContactName,
          "phone": faker.phone.phoneNumber(),
          "email": faker.internet.email(),
          "street": faker.address.streetAddress(),
          "city": faker.address.city(),
          "state": faker.address.state(),
          "zipCode": faker.address.zipCode()
        },
        "bscContact" : {
          "name": faker.name.findName(),
          "phone": faker.phone.phoneNumber(),
          "email": faker.internet.email(),
          "street": faker.address.streetAddress(),
          "city": faker.address.city(),
          "state": faker.address.state(),
          "zipCode": faker.address.zipCode()
        },
        "engagementLevel": engagementLevel,        
        "events": events        
      };

    writeStream.write(JSON.stringify({ "index" : { "_index" : "bsc", "_id" : i } }));
    writeStream.write('\n')
    writeStream.write(JSON.stringify(record));
    writeStream.write('\n')
    i++;
}

//fs.writeFileSync('vendor-data.json', data);