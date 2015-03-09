AccountsTemplates.configure({
    // Appearance
    showForgotPasswordLink: true,

    //Behaviour
    defaultState:"signIn",
    negativeValidation: false,
    negativeFeedback: false,
    positiveValidation: false,
    positiveFeedback: false,
});

AccountsTemplates.removeField('password');
AccountsTemplates.addFields([
    {
        _id: 'password',
        type: 'password',
        required: true,
        minLength: 6,
        re: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
        errStr: 'At least 1 digit, 1 lower-case and 1 upper-case',
    },
    {
        _id: "gender",
        type: "select",
        displayName: "Gender",
        required: true,
        select: [{
            text: "Male",
            value: "male",
        }, {
            text: "Female",
            value: "female",
        }, {
            text: "Not Specified",
            value: "transgender",
        },]
    },
    {
        _id: 'mobile',
        type: 'tel',
        displayName: "Mobile Number",
        placeholder:"Enter 10 digit mobile number",
        required: true,
        re: /^[789]\d{9}$/,
        errStr: 'Invalid mobile number!',
        minLength:10,
        maxLength:10,
        continuousValidation:true,
    },
    {
        _id: 'fullname',
        type: 'text',
        required: true,
        displayName: 'Full Name',
        errStr: 'Only "Full Name" allowed!',
        trim: true,
        minLength: 5,
    },
    {
        _id: 'name',
        type: 'text',
        required: false,
        displayName: 'Display Name ',
        errStr: 'Only "Full Name" allowed!',
        trim: true,
        lowercase: true,
    },
]);
