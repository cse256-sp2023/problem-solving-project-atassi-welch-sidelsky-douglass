require(__dirname + '/../aws-credentials.json'); // make sure that file is there before trying anything else
const AWS = require('aws-sdk');
// process.env.npm_package_url = 'if you are havimg errors about something being undefined then umcomment this line and replace this message with your github pages url.';
if (
    process.env.npm_package_url === "put your repository's home page url here"
) {
    throw new Error(
        'Remember to change the url field in your package.json file to point to your github pages index.html.'
    );
}

AWS.config.loadFromPath(__dirname + '/../aws-credentials.json');

const extQ = `<?xml version="1.0" encoding="UTF-8"?>
                    <ExternalQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd">
                        <ExternalURL>${process.env.npm_package_url}?wustl_key=riley.mccuen.testing&amp;sandbox=false&amp;project=gender-mag&amp;iteration=1&amp;tag=add_new_user</ExternalURL>
                        <FrameHeight>0</FrameHeight>
                    </ExternalQuestion>`;

const request = {
    AssignmentDurationInSeconds: 100000,
    AutoApprovalDelayInSeconds: 100000,
    Description: 'This is a sandbox test hit from the 256 console.',
    LifetimeInSeconds: 1000,
    MaxAssignments: 100,
    Reward: '0.01',
    Title: 'This is a hit for 256 console testing',
    Question: extQ,
};

const m = new AWS.MTurk();
m.createHIT(request, (err, data) => {
    if (err !== null && err !== undefined) {
        console.log('An error has occurred:\n' + JSON.stringify(err, null, 2));
    } else {
        console.log(
            'Your request appears to have gone through successfully:\n' +
                JSON.stringify(data, null, 2)
        );
    }
});
