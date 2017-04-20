# adapt-pageCompletionPlugin

===============================

An extension to show if all component on page are complete or not

```json

{
    "_id":"co-05",
    "_parentId":"course",
    "_type":"page",
    "_classes":"",
    "title":"Welcome to Adapt Learning",
    "displayTitle":"Welcome to Adapt Learning",
    "body":"This page contains a working Adapt page with all core bundled components and plugins working.",
    "_graphic": {
        "alt": "Welcome to Adapt Learning",
        "src": "course/en/images/origami-menu-one.jpg"
    },
    "linkText":"View",
    "duration":"2 mins",
    "_pageCompletion":{
        "_isEnabled":true,
        "_duration":2,
        "_popupTitle":"Welcome to Adapt Learning",
        "_popupText":"Congrats!! You are completed this page",
        "_backLink":{
            "url":"#",
            "linkText":"Go to Menu"
        }

    }
}
```
A description of attributes is as follows:

| Attribute        | Type| Description|
| :------------ |:-------------|:-----|
| _isEnabled        | bool |Set this to *true* if the completionPopup extension should be enabled, or *false* for otherwise|
| _duration         | int      | This is the duration time after which the popup should appear on screen after completion of the page|
| _popupTitle            | string | This is title of the popup |
| _popupText          | string | This is text of popup|
| _backLink            | object | An object containing "url" and "go to Menu" strings |
| url          | string | This is url for backLink |
| linkText          | string | This is text on the backLink button

