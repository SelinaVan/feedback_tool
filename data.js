export const data = {
  "widget": {
    "buttonBgColor": "orange",
    "buttonPosition": "Middle Left",
    "buttonStyle": "Pill button",
    "buttonText": "Feedback",
    "iconName": "fa-circle-question",
    "iconStyleIndex": 1,
    "isAttachLogo": false,
    "logo": {
      src: './allxone.jpg'
    },
    "textColor": "#FFFFFF"
  },
  "thanksMessage": {
    "icon": "Choose an icon",
    "iconColor": "Icon colour",
    "iconColorPicker": "orange",
    "iconIndexStyle": 1,
    "iconName": "fa-face-smile",
    "message": "Message",
    "messageContent": "We really appreciate your feedback.",
    "messageTitle": "Thank you",
    "name": "Thank You Message"
  },
  "formData": [
    {
      "formName": "Report a bug",
      "title": "Tell us what's broken",
      "iconName": "fa-bug",
      "data": [
        {
          "active": true,
          "id": 1,
          "name": "Name",
          "option": { "id": 1, "value": "name", "labelText": "Name", "questionText": "Name" },
          "required": true,
          "type": "text"
        },
        {
          "active": true,
          "id": 2,
          "name": "Email",
          "option": { "id": 1, "value": "email", "labelText": "Email", "questionText": "Email" },
          "required": true,
          "type": "text"
        },
        // {
        //   "active": true,
        //   "id": 3,
        //   "name": "Title",
        //   "option": { "id": 1, "value": "title", "labelText": "Title", "questionText": "Title" },
        //   "required": true,
        //   "type": "text"
        // },
        {
          "active": true,
          "id": 4,
          "name": "Comment",
          "option": {
            "id": 1,
            "value": "comment",
            "labelText": "Comment",
            "questionText": "Comment"
          },
          "required": true,
          "type": "textarea"
        },
        // {
        //   "active": true,
        //   "id": 5,
        //   "name": "Priority",
        //   "option": {
        //     "id": 1,
        //     "value": "priority",
        //     "labelText": "Priority",
        //     "questionText": "Priority",
        //     "answerOption": [
        //       { "id": 1, "value": "low", "text": "Low" },
        //       { "id": 2, "value": "medium", "text": "Medium" },
        //       { "id": 3, "value": "priority", "text": "Priority" }
        //     ]
        //   },
        //   "children": ["Low", "Medium", "Priority"],
        //   "required": true,
        //   "type": "select"
        // },
        {
          "active": true,
          "id": 6,
          "name": "Attachment",
          "option": {
            "id": 1,
            "value": "",
            "labelText": "Attachment",
            "questionText": "Attachment"
          },
          "required": true,
          "type": "file"
        },
        {
          "active": true,
          "id": 7,
          "name": "Rating",
          "option": {
            "id": 1,
            "value": 5,
            "labelText": "Rating",
            "questionText": "Rating"
          },
          "required": true,
          "type": "rating",
          iconName :"fa-star"
        },
        {
          "active": true,
          "id": 8,
          "name": "Button text",
          "option": {
            "id": 1,
            "value": "button text",
            "labelText": "Button text",
            "questionText": "Submit"
          },
          "required": false,
          "type": "button"
        },
        {
          "active": true,
          "id": 9,
          "name": "Screenshot",
          "option": {
            "id": 1,
            "value": "screenshot",
            "labelText": "Screenshot",
            "questionText": "Screenshot"
          },
          "required": false,
          "type": "screenshot"
        },
        // {
        //   "id":10,
        //   "option": {
        //     id: 1, value: 'question 1', labelText: 'question 1', questionText: 'question 1', answerOption:  [
        //       { "id": 1, "value": "option 1", "text": "option 1 " },
        //       { "id": 2, "value": "option 2", "text": "option 2 " }
        //     ]
        // },
        //   "required":false,
        //   "type":"radio"
        // },
        // {
        //   "id": 10,
        //   "option": {
        //     id: 1, value: 'question 1', labelText: 'question 1', questionText: 'question 2', answerOption: [
        //       { "id": 1, "value": "option 1", "text": "option 1 " },
        //       { "id": 2, "value": "option 2", "text": "option 2 " }
        //     ]
        //   },
        //   "required": false,
        //   "type": "checkbox"
        // }
      ]
    },
    {
      "formName": "General feedback",
      "title": "Tell us what we can improve",
      "iconName": "fa-file",
      "data": [
        {
          "active": true,
          "id": 1,
          "name": "Name",
          "option": { "id": 1, "value": "name", "labelText": "Name", "questionText": "Name" },
          "required": true,
          "type": "text"
        },
        {
          "active": true,
          "id": 2,
          "name": "Email",
          "option": { "id": 1, "value": "email", "labelText": "Email", "questionText": "Email" },
          "required": true,
          "type": "text"
        },
        {
          "active": true,
          "id": 3,
          "name": "Title",
          "option": { "id": 1, "value": "title", "labelText": "Title", "questionText": "Title" },
          "required": true,
          "type": "text"
        },
        {
          "active": true,
          "id": 4,
          "name": "Comment",
          "option": {
            "id": 1,
            "value": "comment",
            "labelText": "Comment",
            "questionText": "Comment"
          },
          "required": true,
          "type": "textarea"
        },
        {
          "active": true,
          "id": 5,
          "name": "Priority",
          "option": {
            "id": 1,
            "value": "priority",
            "labelText": "Priority",
            "questionText": "Priority",
            "answerOption": [
              { "id": 1, "value": "low", "text": "Low" },
              { "id": 2, "value": "medium", "text": "Medium" },
              { "id": 3, "value": "priority", "text": "Priority" }
            ]
          },
          "children": ["Low", "Medium", "Priority"],
          "required": true,
          "type": "select"
        },
        {
          "active": true,
          "id": 6,
          "name": "Attachment",
          "option": {
            "id": 1,
            "value": "",
            "labelText": "Attachment",
            "questionText": "Attachment"
          },
          "required": true,
          "type": "file"
        },
        {
          "active": true,
          "id": 7,
          "name": "Rating",
          "option": {
            "id": 1,
            "value": 5,
            "labelText": "Rating",
            "questionText": "Rating"
          },
          "required": true,
          "type": "rating",
          iconName: "fa-star"
        },
        {
          "active": true,
          "id": 8,
          "name": "Button text",
          "option": {
            "id": 1,
            "value": "button text",
            "labelText": "Button text",
            "questionText": "Submit"
          },
          "required": false,
          "type": "button"
        },
        {
          "active": true,
          "id": 9,
          "name": "Screenshot",
          "option": {
            "id": 1,
            "value": "screenshot",
            "labelText": "Screenshot",
            "questionText": "Screenshot"
          },
          "required": false,
          "type": "screenshot"
        },
        {
          "id":10,
          "option": {
            id: 1, value: 'question 1', labelText: 'question 1', questionText: 'question 1', answerOption:  [
              { "id": 1, "value": "option 1", "text": "option 1 " },
              { "id": 2, "value": "option 2", "text": "option 2 " }
            ]
        },
          "required":false,
          "type":"radio"
        },
        {
          "id": 10,
          "option": {
            id: 1, value: 'question 1', labelText: 'question 1', questionText: 'question 2', answerOption: [
              { "id": 1, "value": "option 1", "text": "option 1 " },
              { "id": 2, "value": "option 2", "text": "option 2 " }
            ]
          },
          "required": false,
          "type": "checkbox"
        }
      ]
    }
  ]
}
