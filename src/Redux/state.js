
let state = {
    profilePage: {
        userInfo: {
            name: 'NikoVisioN',
            title: 'IT Developer',
            location: 'Ukraine',
            photo: "NvN"
        },
        postsData: [
            { id: 1, message: 'Hello, world!', likesCount: 15 },
            { id: 2, message: 'How are you?', likesCount: 20 },
            { id: 3, message: 'This is my first post!', likesCount: 30 },
            { id: 4, message: 'Hi', likesCount: 25 },
            { id: 5, message: 'Yo', likesCount: 10 },
            { id: 6, message: 'Bka', likesCount: 5 },
            { id: 7, message: 'LOASJDAWHD', likesCount: 88 },
            { id: 8, message: 'BLABKA', likesCount: 75 },
            { id: 9, message: 'hahahahha', likesCount: 73 }
        ],
    },

    chatsPage: {
        dialogsData: [
            { id: 1, name: 'Dima', photo: 'https://cdn.media.amplience.net/i/canon/canon-ef-85mm-f1.4l-is-usm-sample-031-556x359_3eb73625262844beb42ea75e29c627c8?w=550&qlt=100' },
            { id: 2, name: 'Sasha', photo: null },
            { id: 3, name: 'Sviat', photo: null },
            { id: 4, name: 'Iarik', photo: null },
            { id: 5, name: 'Sveta', photo: null },
            { id: 6, name: 'Katia', photo: null }
        ],
        messagesData: [
            { id: 1, dialogId: 1, name: 'Hi' },
            { id: 2, dialogId: 2, name: 'How are you?' },
            { id: 3, dialogId: 3, name: 'Yo' },
            { id: 4, dialogId: 4, name: 'Hi' },
            { id: 5, dialogId: 5, name: 'Yo' },
            { id: 6, dialogId: 6, name: 'Hi' }
        ]
    }
}

export default state;